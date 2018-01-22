const { Kind } = require('graphql/language');

jest.mock('../../../status', () => ({
  key: 'value',
}));
// eslint-disable-next-line global-require
const { resolvers } = require('../index');

const {
  JWT,
  Crypto,
  Query,
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
});
