const _ = require('lodash');
const { UnauthorizedError } = require('./error');
const Ballot = require('../../models/ballots');
const { project } = require('./projection');
const logger = require('../../logger')('graphql/query');

module.exports = {
  resolvers: {
    Query: {
      ballot(parent, args, context, info) {
        logger.debug('Query.ballot', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        const proj = project(info);
        logger.debug('Project', proj);

        return new Promise((resolve, reject) => {
          Ballot.findById(args.bId, proj, (err, obj) => {
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

      ballots(parent, args, context, info) {
        logger.debug('Query.ballots', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        if (!_.get(context, 'auth.username')) {
          return new UnauthorizedError();
        }

        const proj = project(info);
        logger.debug('Project', proj);

        return new Promise((resolve, reject) => {
          Ballot.find({
            owner: context.auth.username,
          }, proj, (err, obj) => {
            if (err) {
              logger.error('Ballot.find', err);
              reject(err);
            } else {
              logger.debug('Ballot.find', obj);
              resolve(obj);
            }
          });
        });
      },
    },

    BallotField: {
      __resolveType(parent) {
        logger.debug('BallotField.__resolveType', parent);
        switch (parent.type) {
          case 'enum':
            return 'EnumField';
          case 'string':
            return 'StringField';
          default:
            return null;
        }
      },
    },
  },
};
