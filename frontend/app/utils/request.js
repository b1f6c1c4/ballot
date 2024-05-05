import _ from 'lodash';
import makeApi from './request-core';

const apiUrl = (raw) => raw || '/api';

export const makeEndpoint = (url, isWs, g = window) => {
  const api = apiUrl(process.env.API_URL);
  if (!isWs) {
    return api + url;
  }

  const protocol = _.get(g, 'location.protocol') === 'https:' ? 'wss:' : 'ws:';

  if (api.startsWith('//')) {
    return protocol + api + url;
  }

  if (api.startsWith('http:')) {
    return api.replace(/^http:/, 'ws:') + url;
  }

  if (api.startsWith('https:')) {
    return api.replace(/^https:/, 'wss:') + url;
  }

  const host = _.get(g, 'location.host');
  return `${protocol}//${host}${api}${url}`;
};

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

let client;

export const getClient = (c) => {
  if (process.env.NODE_ENV === 'test' && c) {
    client = c;
  } else if (!client) {
    client = makeApi(makeEndpoint);
  }
  return client;
};

export const makeContext = (cred) => !cred ? undefined : {
  headers: {
    authorization: `Bearer ${cred}`,
  },
};

export const query = async (gql, vars, cred) => {
  try {
    const response = await getClient().query({
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
    const response = await getClient().mutate({
      mutation: gql,
      variables: vars,
      context: makeContext(cred),
      fetchPolicy: 'no-cache',
    });
    return postProcess(response);
  } catch (e) {
    return postProcess(e);
  }
};

export const subscribe = async (gql, vars, cred) => {
  try {
    const response = await getClient().subscribe({
      query: gql,
      variables: {
        ...vars,
        authorization: !cred ? undefined : `Bearer ${cred}`,
      },
      fetchPolicy: 'network-only',
    });
    return response;
  } catch (e) {
    return postProcess(e);
  }
};
