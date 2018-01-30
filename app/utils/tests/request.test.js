import {
  makeApi,
  postProcess,
  getClient,
  makeContext,
  query,
  mutate,
} from '../request';

describe('makeApi', () => {
  it('should return default', () => {
    process.env.API_URL = '';
    expect(makeApi('val')).toBe('/apival');
  });

  it('should return default', () => {
    process.env.API_URL = 'sth';
    expect(makeApi('val')).toBe('sthval');
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
