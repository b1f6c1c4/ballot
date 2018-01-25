import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const apiUrl = (raw) => raw || '/api';

export const makeApi = (url) => apiUrl(process.env.API_URL) + url;

// eslint-disable-next-line import/no-mutable-exports
let client;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  /* istanbul ignore next */
  // eslint-disable-next-line global-require
  const { HttpLink } = require('apollo-link-http');
  /* istanbul ignore next */
  client = new ApolloClient({
    link: new HttpLink({ uri: makeApi('/graphql') }),
    cache: new InMemoryCache(),
  });
} else {
  // mock `functions`
  /* istanbul ignore next */
  client = {
    query: /* istanbul ignore next */ () => 'query',
    mutation: /* istanbul ignore next */ () => 'mutation',
  };
}

export default client;
