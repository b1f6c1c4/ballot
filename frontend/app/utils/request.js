import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const apiUrl = (raw) => raw || '/api';

export const makeApi = (url) => apiUrl(process.env.API_URL) + url;

export const postProcess = (raw) => {
  if (!(raw instanceof Error)) {
    return raw.data;
  }

  const {
    message,
    networkError,
    graphQLErrors,
  } = raw;

  const err = { raw };
  const make = () => Object.assign(new Error(message), err);

  if (networkError) {
    err.codes = ['netw'];
    throw make();
  }

  if (Array.isArray(graphQLErrors)) {
    const codes = graphQLErrors.map((e) => e.errorCode).filter((c) => c);
    if (codes.length > 0) {
      err.codes = codes;
    }
    throw make();
  }

  throw make();
};

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
}

export const getClient = /* istanbul ignore next */ (c) => {
  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'test' && c) {
    /* istanbul ignore next */
    client = c;
  }
  /* istanbul ignore next */
  return client;
};

export const makeContext = (cred) => !cred ? undefined : {
  headers: {
    authorization: `Bearer ${cred}`,
  },
};

export const query = async (gql, vars, cred) => {
  try {
    const response = await client.query({
      query: gql,
      variables: vars,
      context: makeContext(cred),
      fetchPolicy: 'network-only',
    });
    return postProcess(response);
  } catch (e) {
    return postProcess(e);
  }
};

export const mutate = async (gql, vars, cred) => {
  try {
    const response = await client.mutate({
      mutation: gql,
      variables: vars,
      context: makeContext(cred),
      fetchPolicy: 'network-only',
    });
    return postProcess(response);
  } catch (e) {
    return postProcess(e);
  }
};
