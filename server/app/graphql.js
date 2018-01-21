const bodyParser = require('body-parser');
const { makeExecutableSchema } = require('graphql-tools');
const { graphqlExpress } = require('apollo-server-express');
const fs = require('fs');
const status = require('../status');

const typeDefs = fs.readFileSync('./docs/public.graphql', 'utf8');
const resolvers = {
  Query: {
    status: () => status,
  },
};
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = [
  bodyParser.text({
    type: 'application/graphql',
  }),
  (req, res, next) => {
    if (req.is('application/graphql')) {
      req.body = { query: req.body };
    }
    next();
  },
  graphqlExpress({
    schema,
    tracing: process.env.NODE_ENV !== 'production',
    formatError: (err) => {
      if (err.originalError && err.originalError.error_message) {
        // eslint-disable-next-line no-param-reassign
        err.message = err.originalError.error_message;
      }

      return err;
    },
  }),
];
