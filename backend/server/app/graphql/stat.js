const errors = require('./error');
const { SignedTicket } = require('../../models/signedTickets');
const { project } = require('./projection');
const throttle = require('./throttle');
const logger = require('../../logger')('graphql/stat');

module.exports = {
  resolvers: {
    Query: {
      async countTickets(parent, args, context) {
        logger.debug('Query.countTickets', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        const { bId } = args.input;

        try {
          await throttle('countTickets', 1, 1000)(bId);

          const res = await SignedTicket.count({ 'payload.bId': bId });
          return res;
        } catch (e) {
          if (e instanceof errors.TooManyRequestsError) return e;
          logger.error('Query countTickets', e);
          return e;
        }
      },

      async tickets(parent, args, context, info) {
        logger.debug('Query.tickets', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        const { bId } = args.input;

        try {
          await throttle('tickets', 1, 10000)(bId);

          const proj = project(info);
          logger.debug('Project', proj);

          const docs = await SignedTicket.find({ 'payload.bId': bId }, proj);
          const objs = docs.map((d) => d.toObject());
          return objs;
        } catch (e) {
          if (e instanceof errors.TooManyRequestsError) return e;
          logger.error('Query tickets', e);
          return e;
        }
      },

      async fieldStat(parent, args, context) {
        logger.debug('Query.fieldStat', args);
        logger.trace('parent', parent);
        logger.trace('context', context);

        const { bId, index } = args.input;

        try {
          await throttle('fieldStat', 1, 1000)(`${bId}:${index}`);

          const ress = await SignedTicket.aggregate([
            { $match: { 'payload.bId': bId } },
            {
              $project: {
                _id: false,
                answer: { $arrayElemAt: ['$payload.result', index] },
              },
            },
            {
              $group: {
                _id: '$answer',
                count: { $sum: 1 },
              },
            },
            {
              $sort: { count: -1 },
            },
          ]);
          return ress;
        } catch (e) {
          if (e instanceof errors.TooManyRequestsError) return e;
          logger.error('Query tickets', e);
          return e;
        }
      },
    },

    FieldStat: {
      answer: (parent) => parent._id,
    },
  },
};
