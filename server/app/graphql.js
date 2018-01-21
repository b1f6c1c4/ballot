const _ = require('lodash');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { makeExecutableSchema } = require('graphql-tools');
const fs = require('fs');
const Ballot = require('../models/ballots');
const status = require('../status');
const logger = require('../logger')('graphql');

/* istanbul ignore next */
const typeDefs = fs.readFileSync('./docs/public.graphql', 'utf8');

const JWT = new GraphQLScalarType({
  name: 'JWT',
  description: 'JWT token.',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});

const Crypto = new GraphQLScalarType({
  name: 'Crypto',
  description: 'Hex string.',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});

const resolvers = {
  JWT,

  Crypto,

  Query: {
    status: () => status,

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

/* istanbul ignore next */
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = {
  resolvers,
  schema,
};
