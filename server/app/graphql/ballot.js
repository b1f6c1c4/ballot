const _ = require('lodash');
const errors = require('./error');
const { Ballot } = require('../../models/ballots');
const { bIdGen, iCodeGen, newRing } = require('../cryptor');
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
          logger.info('Ballot created', ballot._id);
          newRing(ballot);
          return ballot;
        } catch (e) {
          logger.error('Create ballot', e);
          return e;
        }
      },

      async replaceFields(parent, args, context) {
        logger.debug('Mutation.replaceFields', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        if (!_.get(context, 'auth.username')) {
          return new errors.UnauthorizedError();
        }

        const { username } = context.auth;
        const { bId, fields } = args.input;

        try {
          const flds = fields.map((f) => {
            const {
              prompt,
              stringDefault,
              enumItems,
            } = f;
            if (stringDefault && enumItems) {
              throw new errors.FieldMalformedError();
            }
            if (enumItems) {
              return {
                prompt,
                type: 'enum',
                data: enumItems,
              };
            }
            if (stringDefault) {
              return {
                prompt,
                type: 'string',
                data: [stringDefault],
              };
            }
            throw new errors.FieldMalformedError();
          });
          logger.trace('Fields', flds);

          const doc = await Ballot.findById(bId);
          if (!doc) {
            return new errors.NotFoundError();
          }
          logger.trace('Old ballot', doc);
          if (doc.owner !== username) {
            return new errors.UnauthorizedError();
          }
          switch (doc.status) {
            case 'creating':
            case 'inviting':
            case 'invited':
              break;
            default:
              return new errors.StatusNotAllowedError();
          }
          doc.fields = flds;
          await doc.save();
          logger.info('Field replaced', bId);
          return doc.fields.toObject();
        } catch (e) {
          if (e instanceof errors.FieldMalformedError) {
            return e;
          }
          logger.error('Replace fields', e);
          return e;
        }
      },

      async createVoter(parent, args, context) {
        logger.debug('Mutation.createVoter', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        if (!_.get(context, 'auth.username')) {
          return new errors.UnauthorizedError();
        }

        const { username } = context.auth;
        const { bId, name } = args.input;

        if (name.length < 1) {
          return new errors.NameMalformedError();
        }

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
            case 'creating':
            case 'inviting':
              break;
            default:
              return new errors.StatusNotAllowedError();
          }
          const iCode = await iCodeGen();
          const voter = {
            _id: iCode,
            name,
          };
          doc.voters.push(voter);
          await doc.save();
          logger.info('Voter created', { bId, iCode });
          return voter;
        } catch (e) {
          logger.error('Create voter', e);
          return e;
        }
      },

      async deleteVoter(parent, args, context) {
        logger.debug('Mutation.deleteVoter', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        if (!_.get(context, 'auth.username')) {
          return new errors.UnauthorizedError();
        }

        const { username } = context.auth;
        const { bId, iCode } = args.input;

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
            case 'creating':
            case 'inviting':
              break;
            default:
              return new errors.StatusNotAllowedError();
          }
          const oLen = doc.voters.length;
          doc.voters = doc.voters.filter((v) => v._id !== iCode);
          if (oLen === doc.voters.length) {
            return new errors.NotFoundError();
          }
          await doc.save();
          logger.info('Voter removed', { bId, iCode });
          return true;
        } catch (e) {
          logger.error('Delete voter', e);
          return e;
        }
      },

    },
  },
};
