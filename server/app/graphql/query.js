const _ = require('lodash');
const Ballot = require('../../models/ballots');
const logger = require('../../logger')('graphql/query');

module.exports = {
  Query: {
    ballot(parent, args, context) {
      logger.debug('Query.ballot', args);
      logger.trace('parent', parent);
      logger.trace('context', context);

      return new Promise((resolve, reject) => {
        Ballot.findById(args.bId, {
          // TODO
          _id: 1,
          name: 1,
          status: 1,
          'crypto.q': 1,
          'crypto.g': 1,
          'crypto.h': 1,
          fields: 1,
          voters: 1,
        }, (err, obj) => {
          if (err) {
            logger.error('Ballot.findById', err);
            reject(err);
          } else {
            logger.debug('Ballot.findById', obj);
            resolve(obj);
          }
        });
      });
    },
  },

  Ballot: {
    bId: (parent) => parent._id,
    q: (parent) => _.get(parent, 'crypto.q'),
    g: (parent) => _.get(parent, 'crypto.g'),
    h: (parent) => _.get(parent, 'crypto.h'),
  },
};
