const _ = require('lodash');
const errors = require('./error');
const Ballot = require('../../models/ballots');
const { bIdGen, newRing } = require('../cryptor');
const logger = require('../../logger')('graphql/ballot');

module.exports = {
  resolvers: {
    Mutation: {
      async createBallot(parent, args, context) {
        logger.debug('Mutation.createBallot', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        if (!_.get(context, 'auth.username')) {
          return new errors.UnauthorizedError();
        }

        const { username } = context.auth;
        const { name } = args.input;

        if (!/^[a-zA-Z0-9][-a-zA-Z0-9]*$/.test(name)) {
          return new errors.NameMalformedError();
        }

        try {
          const ballot = new Ballot();
          ballot._id = await bIdGen();
          ballot.name = name;
          ballot.owner = username;
          ballot.status = 'creating';
          await ballot.save();
          newRing(ballot);
          return ballot;
        } catch (e) {
          logger.error('Create ballot', e);
          return e;
        }
      },
    },
  },
};

