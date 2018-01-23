const errors = require('./error');
const Ballot = require('../../models/ballots');
const logger = require('../../logger')('graphql/voter');

module.exports = {
  resolvers: {
    Mutation: {
      async registerVoter(parent, args, context) {
        logger.debug('Mutation.registerVoter', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        const {
          bId,
          iCode,
          comment,
          publicKey,
        } = args.input;

        if (!/^([0-9a-z][0-9a-z])+$/.test(publicKey)) {
          return new errors.PublicKeyMalformedError();
        }

        try {
          const doc = await Ballot.findById(bId);
          if (!doc) {
            return new errors.NotFoundError();
          }
          logger.trace('Old ballot', doc);
          switch (doc.status) {
            case 'inviting':
              break;
            default:
              return new errors.StatusNotAllowedError();
          }
          const voter = doc.voters.find((v) => v._id === iCode);
          if (!voter) {
            return new errors.NotFoundError();
          }
          if (voter.publicKey) {
            return new errors.VoterRegisteredError();
          }
          voter.comment = comment;
          voter.publicKey = publicKey;
          await doc.save();
          logger.info('Voter registered', { bId, iCode });
          return true;
        } catch (e) {
          logger.error('Register voter', e);
          return e;
        }
      },
    },
  },
};
