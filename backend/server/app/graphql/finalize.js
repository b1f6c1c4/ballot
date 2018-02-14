const _ = require('lodash');
const errors = require('./error');
const { Ballot } = require('../../models/ballots');
const { genH } = require('../cryptor');
const { updateBallotStatus } = require('../publish');
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
              return new errors.StatusNotAllowedError();
          }
          doc.status = 'preVoting';
          await doc.save();
          logger.info('Fields finalized', bId);
          await updateBallotStatus(doc);
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
              return new errors.StatusNotAllowedError();
          }
          doc.voters = doc.voters.filter((v) => v.publicKey);
          logger.trace('genH...');
          const { h } = await genH(doc);
          logger.trace('genH done', h);
          doc.crypto.h = h;
          doc.status = 'invited';
          await doc.save();
          logger.info('Voters finalized', bId);
          await updateBallotStatus(doc);
          return true;
        } catch (e) {
          logger.error('Finalize voters', e);
          return e;
        }
      },

      async finalizePreVoting(parent, args, context) {
        logger.debug('Mutation.finalizePreVoting', args);
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
            case 'preVoting':
              break;
            default:
              return new errors.StatusNotAllowedError();
          }
          doc.status = 'voting';
          await doc.save();
          logger.info('PreVoting finalized', bId);
          await updateBallotStatus(doc);
          return true;
        } catch (e) {
          logger.error('Finalize pre voting', e);
          return e;
        }
      },

      async finalizeVoting(parent, args, context) {
        logger.debug('Mutation.finalizeVoting', args);
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
            case 'voting':
              break;
            default:
              return new errors.StatusNotAllowedError();
          }
          doc.status = 'finished';
          await doc.save();
          logger.info('Voting finalized', bId);
          await updateBallotStatus(doc);
          return true;
        } catch (e) {
          logger.error('Finalize voting', e);
          return e;
        }
      },
    },
  },
};
