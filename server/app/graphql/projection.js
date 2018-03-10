const _ = require('lodash');
const { genProjection, genResolvers } = require('graphql-advanced-projection');
const logger = require('../../logger')('graphql/projection');

const config = {
  // Ballot
  Ballot: {
    proj: {
      bId: '_id',
      q: 'crypto.q',
      g: 'crypto.g',
      h: 'crypto.h',
      fields: {
        query: ['owner', 'status'],
        recursive: true,
      },
      voters: {
        query: ['owner', 'status'],
        recursive: true,
      },
    },
  },

  // Ballot
  BallotField: {
    prefix: 'fields.',
    typeProj: 'type',
  },

  // Ballot
  StringField: {
    prefix: 'fields.',
    proj: {
      default: {
        query: 'data',
        select: 'data[0]',
      },
    },
  },

  // Ballot
  EnumField: {
    prefix: 'fields.',
    proj: {
      items: 'data',
    },
  },

  // Ballot
  BallotVoter: {
    prefix: 'voters.',
    proj: {
      iCode: '_id',
    },
  },

  // SignedTicket
  BallotTicket: {
    proj: {
      t: '_id',
    },
  },

  // SignedTicket
  TicketPayload: {
    prefix: 'payload.',
  },
};

const project = genProjection(config);

const resolvers = genResolvers(config);
logger.trace('Proj resolvers', _.mapValues(resolvers, Object.keys));

module.exports = {
  project,
  resolvers,
};
