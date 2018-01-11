const restify = require('restify');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const fs = require('fs');

const app = restify.createServer();

const schema = buildSchema(fs.readFileSync('./docs/public.graphql', 'utf8'));

app.post('/graphql', graphqlHTTP({
  schema,
  graphiql: false,
  formatError: (error) => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack,
    path: error.path,
  }),
}));

app.get('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  formatError: (error) => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack,
    path: error.path,
  }),
}));

app.listen(3000, () => {
  console.log('Server started on http://127.0.0.1:3000/');
});