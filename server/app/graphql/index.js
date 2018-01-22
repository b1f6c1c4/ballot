const _ = require('lodash');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { makeExecutableSchema } = require('graphql-tools');
const fs = require('fs');
const status = require('../../status');

const projs = require('./projection').resolvers;
const query = require('./query').resolvers;
const auth = require('./auth').resolvers;

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
  },
};

/* istanbul ignore next */
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: _.merge(
    resolvers,
    projs,
    query,
    auth,
  ),
});

module.exports = {
  resolvers,
  schema,
};
