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
  expect(con).toEqual({ _id: 'bId' });
});
jest.mock('../verify', () => (res, con) => {
  expect(res).toEqual({ valid: 114 });
  expect(con).toEqual({ _id: '3456', bId: 'bId' });
});

const bcryptMock = {
  hash: jest.fn(),
  compare: jest.fn(),
};
jest.doMock('bcrypt', () => bcryptMock);
const cryptorMock = {
  newRing: jest.fn(),
  genH: jest.fn(),
  verify: jest.fn(),
};
jest.doMock('../../cryptor.node', () => cryptorMock);

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
    bcryptMock.hash.mockReset();
  });

  it('should resolve', () => {
    bcryptMock.hash.mockImplementationOnce((p, n) => {
      expect(p).toEqual('pwd');
      expect(n).toEqual(14);
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
    bcryptMock.compare.mockReset();
  });

  it('should resolve', () => {
    bcryptMock.compare.mockImplementationOnce((p, h) => {
      expect(p).toEqual('pwd');
      expect(h).toEqual('hah');
      return 123;
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
    cryptorMock.newRing.mockReset();
  });

  it('should call newRing.js', () => {
    cryptorMock.newRing.mockImplementationOnce(() => ({
      key: 'val3',
    }));

    // eslint-disable-next-line global-require
    const { newRing } = require('../cryptor');
    expect.hasAssertions();
    newRing({ _id: 'bId', key: 'value' });
  });
});

describe('genH', () => {
  beforeEach(() => {
    cryptorMock.genH.mockReset();
  });

  it('should resolve', () => {
    cryptorMock.genH.mockImplementationOnce((o) => {
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
    cryptorMock.verify.mockReset();
  });

  it('should call publish', () => {
    cryptorMock.verify.mockImplementationOnce((o) => {
      expect(o).toEqual({
        q: 'valq',
        g: 'valg',
        h: 'valh',
        publicKeys: ['p1', 'p2'],
        t: 'valt',
        payload: '{"a":1,"b":2}',
        s: ['s1', 's2'],
        c: ['c1', 'c2'],
      });
      expect.hasAssertions();
      return 114;
    });

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
  });
});
