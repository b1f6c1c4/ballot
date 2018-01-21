// const mockingoose = require('mockingoose').default;
const { Kind } = require('graphql/language');

jest.mock('../../status', () => ({
  key: 'value',
}));
// eslint-disable-next-line global-require
const { resolvers } = require('../graphql');

const {
  JWT,
  Crypto,
  Query,
  Ballot,
} = resolvers;

describe('JWT', () => {
  it('serialize string', () => {
    expect(JWT.serialize('val')).toEqual('val');
  });

  it('parseValue string', () => {
    expect(JWT.parseValue('val')).toEqual('val');
  });

  it('parseLiteral string', () => {
    expect(JWT.parseLiteral({
      kind: Kind.STRING,
      value: 'val',
    })).toEqual('val');
  });

  it('parseLiteral null', () => {
    expect(JWT.parseLiteral({
      kind: Kind.FLOAT,
      value: '123.456',
    })).toBeNull();
  });
});

describe('Crypto', () => {
  it('serialize string', () => {
    expect(Crypto.serialize('val')).toEqual('val');
  });

  it('parseValue string', () => {
    expect(Crypto.parseValue('val')).toEqual('val');
  });

  it('parseLiteral string', () => {
    expect(Crypto.parseLiteral({
      kind: Kind.STRING,
      value: 'val',
    })).toEqual('val');
  });

  it('parseLiteral null', () => {
    expect(Crypto.parseLiteral({
      kind: Kind.FLOAT,
      value: '123.456',
    })).toBeNull();
  });
});

describe('Query', () => {
  describe('status', () => {
    it('should return status', () => {
      expect(Query.status()).toEqual({
        key: 'value',
      });
    });
  });

  //  describe('ballot', () => {
  //    describe('with bId', () => {
  //      it('should query by id', () => {
  //        mockingoose.Ballot.toReturn({
  //          key: 'value',
  //        }, 'findOne');
  //
  //        expect(Query.ballot(undefined, { bId: 'val' }, undefined))
  //          .resolve.toEqual({
  //            key: 'value',
  //          });
  //      });
  //    });
  //  });
});

describe('Ballot', () => {
  describe('bId', () => {
    it('normal', () => {
      expect(Ballot.bId({ _id: 'value' })).toEqual('value');
    });
  });

  describe('q', () => {
    it('undefined', () => {
      expect(Ballot.q({})).not.toEqual(expect.anything());
    });

    it('null', () => {
      expect(Ballot.q({ crypto: null })).not.toEqual(expect.anything());
    });

    it('normal', () => {
      expect(Ballot.q({ crypto: { q: 'value' } })).toEqual('value');
    });
  });

  describe('g', () => {
    it('undefined', () => {
      expect(Ballot.g({})).not.toEqual(expect.anything());
    });

    it('null', () => {
      expect(Ballot.g({ crypto: null })).not.toEqual(expect.anything());
    });

    it('normal', () => {
      expect(Ballot.g({ crypto: { g: 'value' } })).toEqual('value');
    });
  });

  describe('h', () => {
    it('undefined', () => {
      expect(Ballot.h({})).not.toEqual(expect.anything());
    });

    it('null', () => {
      expect(Ballot.h({ crypto: null })).not.toEqual(expect.anything());
    });

    it('normal', () => {
      expect(Ballot.h({ crypto: { h: 'value' } })).toEqual('value');
    });
  });
});
