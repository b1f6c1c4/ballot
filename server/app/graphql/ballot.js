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

      async replaceFields(parent, args, context) {
        logger.debug('Mutation.replaceFields', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        if (!_.get(context, 'auth.username')) {
          return new errors.UnauthorizedError();
        }

        const { username } = context.auth;
        const { bId, fields } = args.input;

        if (!Array.isArray(fields)) {
          return new errors.FieldMalformedError();
        }

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
          doc.fields = flds;
          await doc.save();
          return doc.fields;
        } catch (e) {
          if (e instanceof errors.FieldMalformedError) {
            return e;
          }
          logger.error('Replace fields', e);
          return e;
        }
      },
    },
  },
};

