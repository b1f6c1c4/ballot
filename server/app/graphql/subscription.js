const _ = require('lodash');
const errors = require('./error');
const { PubSub, withFilter } = require('graphql-subscriptions');
const logger = require('../../logger')('graphql/subscription');
const rpc = require('../../rpc');

const pubsub = new PubSub();

const subsLib = new Map();

const lock = async (k, cb) => {
  const obj = subsLib.get(k);
  if (obj) {
    logger.debug('Subs cache hit', k);
    obj.num += 1;
    return;
  }
  logger.debug('Subs cache miss', k);
  const diss = await rpc.subscribe(k, cb);
  subsLib.set(k, {
    num: 1,
    diss,
  });
};

const unlock = (k) => {
  const obj = subsLib.get(k);
  if (!obj) {
    logger.warn('Subs not found', k);
    return;
  }
  obj.num -= 1;
  if (obj.num > 0) {
    logger.debug('Subs cache diss', k);
    return;
  }
  logger.debug('Dismiss', k);
  obj.diss();
  subsLib.delete(k);
};

const subscribeBallotStatus = async (bId) => {
  const k = `status.*.${bId}`;
  await lock(k, (res) => {
    logger.debug('Pubsub.publish', res);
  });
  return () => unlock(k);
};

const subscribeBallotsStatus = async (owner) => {
  const k = `status.${owner}.*`;
  await lock(k, (res) => {
    logger.debug('Pubsub.publish', res);
  });
  return () => unlock(k);
};

module.exports = {
  async updateBallotStatus(ballot) {
    const { owner, bId, status } = ballot;
    await rpc.rawPublish(`status.${owner}.${bId}`, status);
  },

  onOperation(message, params, ws) {
    const opId = message.id;
    logger.debug('Operation', message);
    if (!ws.registry) {
      logger.debug('Assign registry to websocket');
      _.set(ws, 'registry', new Map());
    }
    _.set(params, 'context.registry', ws.registry);
    _.set(params, 'context.opId', opId);
    return params;
  },

  onOperationComplete(ws, opId) {
    logger.debug('Operation complete', opId);
    if (!ws.registry) {
      logger.warn('No registry found');
      return;
    }
    const cb = ws.registry.get(opId);
    if (!_.isFunction(cb)) {
      logger.warn('Callback is not function', cb);
      return;
    }
    cb();
  },

  resolvers: {
    Subscription: {
      ballotStatus: {
        subscribe: async (parent, args, context, info) => {
          logger.debug('Subscription.ballotStatus.subscribe', args);
          logger.trace('parent', parent);
          logger.trace('context', context);

          const { bId } = args.input;

          try {
            const cb = await subscribeBallotStatus(bId);
            context.registry.set(context.opId, cb);

            return withFilter(
              () => pubsub.asyncIterator(`ballotStatus.${bId}`),
              (p) => {
                if (p && p.ballotStatus) {
                  return p.ballotStatus.bId === bId;
                }
                return true;
              },
            )(parent, args, context, info);
          } catch (e) {
            logger.error('Subscribe ballotStatus', e);
            throw e;
          }
        },
      },
      ballotsStatus: {
        subscribe: async (parent, args, context, info) => {
          logger.debug('Subscription.ballotsStatus.subscribe', args);
          logger.trace('parent', parent);
          logger.trace('context', context);

          if (!_.get(context, 'auth.username')) {
            return new errors.UnauthorizedError();
          }

          const { username } = context.auth;

          try {
            const cb = await subscribeBallotsStatus(username);
            context.registry.set(context.opId, cb);

            return withFilter(
              () => pubsub.asyncIterator(`ballotsStatus.${username}`),
              (p) => {
                if (p && p.ballotStatus) {
                  return p.ballotStatus.owner === username;
                }
                return true;
              },
            )(parent, args, context, info);
          } catch (e) {
            logger.error('Subscribe ballotsStatus', e);
            throw e;
          }
        },
      },
    },
  },
};
