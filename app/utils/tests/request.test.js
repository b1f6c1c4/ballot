import {
  makeApi,
  postProcess,
  getClient,
  makeContext,
  query,
  mutate,
  subscribe,
} from '../request';

describe('makeApi', () => {
  describe('http', () => {
    it('should return default', () => {
      process.env.API_URL = '';
      expect(makeApi('val')).toBe('/apival');
    });

    it('should return api', () => {
      process.env.API_URL = 'sth';
      expect(makeApi('val')).toBe('sthval');
    });
  });

  describe('websocket', () => {
    it('should respect http protocol if api is host', () => {
      const g = { location: { protocol: 'http:' } };
      process.env.API_URL = '//itst/';
      expect(makeApi('val', true, g)).toEqual('ws://itst/val');
    });

    it('should respect https protocol if api is host', () => {
      const g = { location: { protocol: 'https:' } };
      process.env.API_URL = '//itst/';
      expect(makeApi('val', true, g)).toEqual('wss://itst/val');
    });

    it('should respect http protocol if api is http', () => {
      const g = { location: { protocol: 'http:' } };
      process.env.API_URL = 'http://itst/';
      expect(makeApi('val', true, g)).toEqual('ws://itst/val');
    });

    it('should not respect https protocol if api is http', () => {
      const g = { location: { protocol: 'https:' } };
      process.env.API_URL = 'http://itst/';
      expect(makeApi('val', true, g)).toEqual('ws://itst/val');
    });

    it('should not respect http protocol if api is https', () => {
      const g = { location: { protocol: 'http:' } };
      process.env.API_URL = 'https://itst/';
      expect(makeApi('val', true, g)).toEqual('wss://itst/val');
    });

    it('should respect https protocol if api is https', () => {
      const g = { location: { protocol: 'https:' } };
      process.env.API_URL = 'https://itst/';
      expect(makeApi('val', true, g)).toEqual('wss://itst/val');
    });

    it('should respect protocol http if api is relative', () => {
      const g = { location: { protocol: 'http:', host: 'haha' } };
      process.env.API_URL = '/itst';
      expect(makeApi('val', true, g)).toEqual('ws://haha/itstval');
    });

    it('should respect protocol https if api is relative', () => {
      const g = { location: { protocol: 'https:', host: 'haha' } };
      process.env.API_URL = '/itst';
      expect(makeApi('val', true, g)).toEqual('wss://haha/itstval');
    });
  });
});

describe('postProcess', () => {
  it('should strip data', () => {
    expect(postProcess({ data: 'val' })).toEqual('val');
  });

  it('should handle network error', () => {
    const e = new Error();
    e.message = 'msg';
    e.networkError = 'nwe';
    try {
      postProcess(e);
      expect(undefined).toBeDefined();
    } catch (res) {
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('msg');
      expect(res.raw).toBe(e);
      expect(res.codes).toEqual(['netw']);
    }
  });

  it('should handle unknown error 1', () => {
    const e = new Error();
    e.message = 'msg';
    try {
      postProcess(e);
      expect(undefined).toBeDefined();
    } catch (res) {
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('msg');
      expect(res.raw).toBe(e);
      expect(res.codes).toBeUndefined();
    }
  });

  it('should handle unknown error 2', () => {
    const e = new Error();
    e.message = 'msg';
    e.graphQLErrors = [{}];
    try {
      postProcess(e);
      expect(undefined).toBeDefined();
    } catch (res) {
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('msg');
      expect(res.raw).toBe(e);
      expect(res.codes).toBeUndefined();
    }
  });

  it('should handle graphql error', () => {
    const e = new Error();
    e.message = 'msg';
    e.graphQLErrors = [{ errorCode: 'c' }, { errorCode: 'd' }];
    try {
      postProcess(e);
      expect(undefined).toBeDefined();
    } catch (res) {
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('msg');
      expect(res.raw).toBe(e);
      expect(res.codes).toEqual(['c', 'd']);
    }
  });
});

describe('makeContext', () => {
  it('should ignore empty', () => {
    expect(makeContext('')).toBeUndefined();
  });

  it('should ignore null', () => {
    expect(makeContext(null)).toBeUndefined();
  });

  it('should ignore undefined', () => {
    expect(makeContext(undefined)).toBeUndefined();
  });

  it('should append bearer', () => {
    expect(makeContext('aa')).toEqual({
      headers: { authorization: 'Bearer aa' },
    });
  });
});

describe('query', () => {
  it('should post process', async (done) => {
    getClient({
      async query(opt) {
        expect(opt).toEqual({
          query: 'gql',
          variables: 'vars',
          fetchPolicy: 'network-only',
        });
        return { data: 'v' };
      },
    });
    const res = await query('gql', 'vars');
    expect(res).toEqual('v');
    done();
  });

  it('should catch error and post process', async (done) => {
    getClient({
      async query(opt) {
        expect(opt).toEqual({
          query: 'gql',
          variables: 'vars',
          fetchPolicy: 'network-only',
        });
        throw new Error('ee');
      },
    });
    try {
      await query('gql', 'vars');
      expect(undefined).toBeDefined();
    } catch (res) {
      expect(res.raw.message).toEqual('ee');
    }
    done();
  });
});

describe('mutate', () => {
  it('should post process', async (done) => {
    getClient({
      async mutate(opt) {
        expect(opt).toEqual({
          mutation: 'gql',
          variables: 'vars',
          fetchPolicy: 'no-cache',
        });
        return { data: 'v' };
      },
    });
    const res = await mutate('gql', 'vars');
    expect(res).toEqual('v');
    done();
  });

  it('should catch error and post process', async (done) => {
    getClient({
      async mutate(opt) {
        expect(opt).toEqual({
          mutation: 'gql',
          variables: 'vars',
          fetchPolicy: 'no-cache',
        });
        throw new Error('ee');
      },
    });
    try {
      await mutate('gql', 'vars');
      expect(undefined).toBeDefined();
    } catch (res) {
      expect(res.raw.message).toEqual('ee');
    }
    done();
  });
});

describe('subscribe', () => {
  it('should not post process no cred', async (done) => {
    getClient({
      async subscribe(opt) {
        expect(opt).toEqual({
          query: 'gql',
          variables: { v: 'vars' },
          fetchPolicy: 'network-only',
        });
        return { data: 'v' };
      },
    });
    const res = await subscribe('gql', { v: 'vars' });
    expect(res).toEqual({ data: 'v' });
    done();
  });

  it('should not post process', async (done) => {
    getClient({
      async subscribe(opt) {
        expect(opt).toEqual({
          query: 'gql',
          variables: { v: 'vars', authorization: 'Bearer cre' },
          fetchPolicy: 'network-only',
        });
        return { data: 'v' };
      },
    });
    const res = await subscribe('gql', { v: 'vars' }, 'cre');
    expect(res).toEqual({ data: 'v' });
    done();
  });

  it('should catch error and post process', async (done) => {
    getClient({
      async subscribe(opt) {
        expect(opt).toEqual({
          query: 'gql',
          variables: { v: 'vars' },
          fetchPolicy: 'network-only',
        });
        throw new Error('ee');
      },
    });
    try {
      await subscribe('gql', { v: 'vars' });
      expect(undefined).toBeDefined();
    } catch (res) {
      expect(res.raw.message).toEqual('ee');
    }
    done();
  });
});
