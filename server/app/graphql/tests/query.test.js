// const mockingoose = require('mockingoose').default;
const { resolvers } = require('../query');
const { UnauthorizedError } = require('../error');

const {
  Query,
  BallotField,
} = resolvers;

describe('Query', () => {
  describe('ballot', () => {
    it('should query', () => {
      // TODO
      // mockingoose.Ballot.toReturn({
      //   key: 'value',
      // }, 'findOne');

      // expect(Query.ballot(undefined, { bId: 'val' }, undefined))
      //   .resolve.toEqual({
      //     key: 'value',
      //   });
    });
  });

  describe('ballots', () => {
    it('should throw if unauthorized', () => {
      expect(Query.ballots(undefined, undefined, { auth: undefined }, undefined)).toBeInstanceOf(UnauthorizedError);
    });
  });
});

describe('BallotField', () => {
  it('should classify enum', () => {
    expect(BallotField.__resolveType({ type: 'enum' })).toEqual('EnumField');
  });
  it('should classify string', () => {
    expect(BallotField.__resolveType({ type: 'string' })).toEqual('StringField');
  });
  it('should not classify unknown', () => {
    expect(BallotField.__resolveType({ type: 'wtf' })).toBeNull();
  });
  it('should not classify undefined', () => {
    expect(BallotField.__resolveType({})).toBeNull();
  });
});
