const _ = require('lodash');
const errors = require('./error');
const Ballot = require('../../models/ballots');
const { genH } = require('../cryptor');
const logger = require('../../logger')('graphql/finalize');

module.exports = {
  resolvers: {
    Mutation: {
      async finalizeFields(parent, args, context) {
        logger.debug('Mutation.finalizeFields', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        if (!_.get(context, 'auth.username')) {
          return new errors.UnauthorizedError();
        }

        const { username } = context.auth;
        const { bId } = args.input;

        try {
          const doc = await Ballot.findById(bId);
          if (!doc) {
            return new errors.NotFoundError();
          }
          logger.trace('Old ballot', doc);
          if (doc.owner !== username) {
            return new errors.UnauthorizedError();
          }
          switch (doc.status) {
            case 'invited':
              break;
            default:
              return new errors.StatusNotInvitedError();
          }
          doc.status = 'preVoting';
          await doc.save();
          logger.info('Fields finalized', bId);
          return true;
        } catch (e) {
          logger.error('Finalize fields', e);
          return e;
        }
      },

      async finalizeVoters(parent, args, context) {
        logger.debug('Mutation.finalizeVoters', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        if (!_.get(context, 'auth.username')) {
          return new errors.UnauthorizedError();
        }

        const { username } = context.auth;
        const { bId } = args.input;

        try {
          const doc = await Ballot.findById(bId);
          if (!doc) {
            return new errors.NotFoundError();
          }
          logger.trace('Old ballot', doc);
          if (doc.owner !== username) {
            return new errors.UnauthorizedError();
          }
          switch (doc.status) {
            case 'inviting':
              break;
            default:
              return new errors.StatusNotInvitingError();
          }
          doc.voters = doc.voters.filter((v) => v.publicKey);
          logger.trace('genH...');
          const h = await genH(doc);
          logger.trace('genH done', h);
          doc.crypto.h = h;
          doc.status = 'invited';
          await doc.save();
          logger.info('Voters finalized', bId);
          return true;
        } catch (e) {
          logger.error('Finalize voters', e);
          return e;
        }
      },
    },
  },
};
