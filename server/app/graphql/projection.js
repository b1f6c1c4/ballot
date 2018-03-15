const gqlProjection = require('graphql-advanced-projection');

module.exports = gqlProjection({
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
  BallotField: {
    typeProj: 'type',
  },
  StringField: {
    proj: {
      default: {
        query: 'data',
        select: 'data[0]',
      },
    },
  },
  EnumField: {
    proj: {
      items: 'data',
    },
  },
  BallotVoter: {
    proj: {
      iCode: '_id',
    },
  },
  BallotTicket: {
    proj: {
      t: '_id',
      payload: true,
    },
  },
});
