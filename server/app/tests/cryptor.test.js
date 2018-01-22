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
    // TODO
    // handler(undefined, {
    //   q: 'qval',
    //   g: 'gval',
    // }, {
    //   method: 'newRing',
    //   _id: 'val',
    // });
  });
});

describe('bIdGen', () => {
  // eslint-disable-next-line global-require
  const { bIdGen } = require('../cryptor');

  it('should resolve hex string', () => {
    cryptoMock.size = 256 / 8;
    cryptoMock.err = undefined;
    cryptoMock.buf = Buffer.from([0xab, 0xcd, 0x12, 0x34]);
    return expect(bIdGen()).resolves.toEqual('abcd1234');
  });

  it('should reject err', () => {
    cryptoMock.size = 256 / 8;
    cryptoMock.err = { key: 'val' };
    cryptoMock.buf = undefined;
    return expect(bIdGen()).rejects.toBe(cryptoMock.err);
  });
});

describe('argon2i', () => {
  beforeEach(() => {
    rpcMock.call.mockReset();
  });

  it('should resolve with out salt', () => {
    rpcMock.call.mockImplementationOnce((n, o) => {
      expect(n).toEqual('argon2i');
      expect(o.password).toEqual('pwd');
      expect(o.salt).toBeUndefined();
      return {
        hash: 'hah',
        salt: 'sal',
      };
    });

    // eslint-disable-next-line global-require
    const { argon2i } = require('../cryptor');
    return expect(argon2i('pwd')).resolves.toEqual({
      hash: 'hah',
      salt: 'sal',
    });
  });

  it('should resolve with salt', () => {
    rpcMock.call.mockImplementationOnce((n, o) => {
      expect(n).toEqual('argon2i');
      expect(o.password).toEqual('pwd');
      expect(o.salt).toEqual('sal');
      return {
        hash: 'hah',
        salt: 'sal',
      };
    });

    // eslint-disable-next-line global-require
    const { argon2i } = require('../cryptor');
    return expect(argon2i('pwd', 'sal')).resolves.toEqual({
      hash: 'hah',
      salt: 'sal',
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
      q: 'valq',
      g: 'valg',
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
    rpcMock.call.mockReset();
  });

  it('should resolve false if valid === 0', () => {
    rpcMock.call.mockImplementationOnce((n, o) => {
      expect(n).toEqual('verify');
      expect(o.q).toEqual('valq');
      expect(o.g).toEqual('valg');
      expect(o.h).toEqual('valh');
      expect(o.publicKeys).toEqual(['p1', 'p2']);
      expect(o.t).toEqual('valt');
      expect(o.payload).toEqual('{"a":1,"b":2}');
      expect(o.s).toEqual(['s1', 's2']);
      expect(o.c).toEqual(['c1', 'c2']);
      return {
        valid: 0,
      };
    });

    // eslint-disable-next-line global-require
    const { verify } = require('../cryptor');
    return expect(verify({
      q: 'valq',
      g: 'valg',
      h: 'valh',
      voters: [{
        publicKey: 'p1',
      }, {
        publicKey: 'p2',
      }],
      key: 'value',
    }, {
      t: 'valt',
      payload: {
        b: 2,
        a: 1,
      },
      s: ['s1', 's2'],
      c: ['c1', 'c2'],
    })).resolves.toEqual(false);
  });

  it('should resolve false if valid === 1', () => {
    rpcMock.call.mockImplementationOnce((n, o) => {
      expect(n).toEqual('verify');
      expect(o.q).toEqual('valq');
      expect(o.g).toEqual('valg');
      expect(o.h).toEqual('valh');
      expect(o.publicKeys).toEqual(['p1', 'p2']);
      expect(o.t).toEqual('valt');
      expect(o.payload).toEqual('{"a":1,"b":2}');
      expect(o.s).toEqual(['s1', 's2']);
      expect(o.c).toEqual(['c1', 'c2']);
      return {
        valid: 1,
      };
    });

    // eslint-disable-next-line global-require
    const { verify } = require('../cryptor');
    return expect(verify({
      q: 'valq',
      g: 'valg',
      h: 'valh',
      voters: [{
        publicKey: 'p1',
      }, {
        publicKey: 'p2',
      }],
      key: 'value',
    }, {
      t: 'valt',
      payload: {
        b: 2,
        a: 1,
      },
      s: ['s1', 's2'],
      c: ['c1', 'c2'],
    })).resolves.toEqual(true);
  });
});
