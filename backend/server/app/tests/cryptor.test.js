const cryptoMock = {
  size: null,
  err: null,
  buf: null,
};
jest.doMock('crypto', () => ({
  randomBytes(size, cb) {
    expect(size).toEqual(cryptoMock.size);
    cb(cryptoMock.err, cryptoMock.buf);
  },
}));
jest.mock('../newRing', () => (res, con) => {
  expect(res).toEqual({ key: 'val3' });
  expect(con).toEqual({ method: 'newRing', key: 'val4' });
});
jest.mock('../verify', () => (res, con) => {
  expect(res).toEqual({ key: 'val1' });
  expect(con).toEqual({ method: 'verify', key: 'val2' });
});

const rpcMock = {
  onPMessage() {},
  publish: jest.fn(),
  call: jest.fn(),
};
jest.doMock('../../rpc', () => rpcMock);

describe('handler', () => {
  // eslint-disable-next-line global-require
  const { handler } = require('../cryptor');

  it('should not throw if error', () => {
    expect(() => handler(new Error(), undefined)).not.toThrow();
  });

  it('should not throw if method not found', () => {
    expect(() => handler(undefined, undefined, {})).not.toThrow();
  });

  it('should handle newRing', () => {
    expect.hasAssertions();
    handler(undefined, { key: 'val3' }, { method: 'newRing', key: 'val4' });
  });

  it('should handle verify', () => {
    expect.hasAssertions();
    handler(undefined, { key: 'val1' }, { method: 'verify', key: 'val2' });
  });
});

describe('idGen', () => {
  // eslint-disable-next-line global-require
  const { idGen } = require('../cryptor');

  it('should resolve hex string', () => {
    cryptoMock.size = 256 / 8;
    cryptoMock.err = undefined;
    cryptoMock.buf = Buffer.from([0xab, 0xcd, 0x12, 0x34]);
    return expect(idGen(32)()).resolves.toEqual('abcd1234');
  });

  it('should reject err', () => {
    cryptoMock.size = 256 / 8;
    cryptoMock.err = { key: 'val' };
    cryptoMock.buf = undefined;
    return expect(idGen(32)()).rejects.toBe(cryptoMock.err);
  });
});

describe('hashPassword', () => {
  beforeEach(() => {
    rpcMock.call.mockReset();
  });

  it('should resolve', () => {
    rpcMock.call.mockImplementationOnce((n, o) => {
      expect(n).toEqual('hashPassword');
      expect(o.password).toEqual('pwd');
      return {
        hash: 'hah',
      };
    });

    // eslint-disable-next-line global-require
    const { hashPassword } = require('../cryptor');
    return expect(hashPassword('pwd')).resolves.toEqual({
      hash: 'hah',
    });
  });
});

describe('verifyPassword', () => {
  beforeEach(() => {
    rpcMock.call.mockReset();
  });

  it('should resolve', () => {
    rpcMock.call.mockImplementationOnce((n, o) => {
      expect(n).toEqual('verifyPassword');
      expect(o.password).toEqual('pwd');
      expect(o.hash).toEqual('hah');
      return {
        valid: 123,
      };
    });

    // eslint-disable-next-line global-require
    const { verifyPassword } = require('../cryptor');
    return expect(verifyPassword('pwd', 'hah')).resolves.toEqual({
      valid: 123,
    });
  });
});

describe('newRing', () => {
  beforeEach(() => {
    rpcMock.publish.mockReset();
  });

  it('should call publish', () => {
    // eslint-disable-next-line global-require
    const { newRing } = require('../cryptor');
    newRing({
      _id: 'bId',
      key: 'value',
    });
    expect(rpcMock.publish.mock.calls.length).toEqual(1);
    expect(rpcMock.publish.mock.calls[0][0]).toEqual('newRing');
    expect(rpcMock.publish.mock.calls[0][1]).toBeUndefined();
    expect(rpcMock.publish.mock.calls[0][2]).toEqual({
      reply: {
        method: 'newRing',
        _id: 'bId',
      },
    });
  });
});

describe('genH', () => {
  beforeEach(() => {
    rpcMock.call.mockReset();
  });

  it('should resolve', () => {
    rpcMock.call.mockImplementationOnce((n, o) => {
      expect(n).toEqual('genH');
      expect(o.q).toEqual('valq');
      expect(o.g).toEqual('valg');
      expect(o.publicKeys).toEqual(['p1', 'p2']);
      return {
        h: 'valh',
      };
    });

    // eslint-disable-next-line global-require
    const { genH } = require('../cryptor');
    return expect(genH({
      crypto: {
        q: 'valq',
        g: 'valg',
      },
      voters: [{
        publicKey: 'p1',
      }, {
        publicKey: 'p2',
      }],
      key: 'value',
    })).resolves.toEqual({
      h: 'valh',
    });
  });
});

describe('verify', () => {
  beforeEach(() => {
    rpcMock.publish.mockReset();
  });

  it('should call publish', () => {
    // eslint-disable-next-line global-require
    const { verify } = require('../cryptor');
    verify({
      _id: 'bId',
      crypto: {
        q: 'valq',
        g: 'valg',
        h: 'valh',
      },
      voters: [{
        publicKey: 'p1',
      }, {
        publicKey: 'p2',
      }],
      key: 'value',
    }, {
      _id: '3456',
      ticket: {
        _id: 'valt',
        payload: {
          b: 2,
          a: 1,
        },
        s: ['s1', 's2'],
        c: ['c1', 'c2'],
      },
    });
    expect(rpcMock.publish.mock.calls.length).toEqual(1);
    expect(rpcMock.publish.mock.calls[0][0]).toEqual('verify');
    expect(rpcMock.publish.mock.calls[0][1]).toEqual({
      q: 'valq',
      g: 'valg',
      h: 'valh',
      publicKeys: ['p1', 'p2'],
      t: 'valt',
      payload: '{"a":1,"b":2}',
      s: ['s1', 's2'],
      c: ['c1', 'c2'],
    });
    expect(rpcMock.publish.mock.calls[0][2]).toEqual({
      reply: {
        method: 'verify',
        _id: '3456',
        bId: 'bId',
      },
    });
  });
});
