const _ = require('lodash');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { makeExecutableSchema } = require('graphql-tools');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const fs = require('fs');
const status = require('../../status');

const projs = require('./projection').resolvers;
const query = require('./query').resolvers;
const stat = require('./stat').resolvers;
const auth = require('./auth').resolvers;
const ballot = require('./ballot').resolvers;
const finalize = require('./finalize').resolvers;
const voter = require('./voter').resolvers;
const {
  onOperation,
  onOperationComplete,
  resolvers: subscription,
} = require('./subscription');

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
    stat,
    auth,
    ballot,
    finalize,
    voter,
    subscription,
  ),
});

module.exports = {
  resolvers,
  schema,
  makeServer: /* istanbul ignore next */ (server) => new SubscriptionServer({
    execute,
    subscribe,
    schema,
    onOperation,
    onOperationComplete,
  }, {
    server,
    path: '/api/subscriptions',
  }),
};
