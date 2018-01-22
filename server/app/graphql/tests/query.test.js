// const mockingoose = require('mockingoose').default;
const { resolvers } = require('../query');
const errors = require('../error');

const {
  Query,
  Ballot,
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
      expect(Query.ballots(undefined, undefined, { auth: undefined }, undefined)).toBeInstanceOf(errors.UnauthorizedError);
    });
  });
});

describe('Ballot', () => {
  describe('fields', () => {
    it('should not throw if no auth required', () => {
      const statuses = [
        'preVoting',
        'voting',
        'finished',
      ];
      statuses.forEach((st) => {
        expect(Ballot.fields({
          status: st,
          owner: 'un',
          fields: 'value',
        }, undefined, { auth: undefined }, undefined)).toEqual('value');
      });
    });
    it('should throw if unauthorized', () => {
      const statuses = [
        'created',
        'inviting',
        'invited',
      ];
      statuses.forEach((st) => {
        expect(Ballot.fields({
          status: st,
          owner: 'un',
        }, undefined, { auth: undefined }, undefined))
          .toBeInstanceOf(errors.UnauthorizedError);
      });
    });
    it('should throw if forbidden', () => {
      const statuses = [
        'created',
        'inviting',
        'invited',
      ];
      statuses.forEach((st) => {
        expect(Ballot.fields({
          status: st,
          owner: 'un',
        }, undefined, { auth: { username: 'unx' } }, undefined))
          .toBeInstanceOf(errors.UnauthorizedError);
      });
    });
    it('should not throw if allowed', () => {
      const statuses = [
        'created',
        'inviting',
        'invited',
      ];
      statuses.forEach((st) => {
        expect(Ballot.fields({
          status: st,
          owner: 'un',
          fields: 'value',
        }, undefined, { auth: { username: 'un' } }, undefined))
          .toEqual('value');
      });
    });
  });

  describe('voters', () => {
    it('should not throw if no auth required', () => {
      const statuses = [
        'invited',
        'preVoting',
        'voting',
        'finished',
      ];
      statuses.forEach((st) => {
        expect(Ballot.voters({
          status: st,
          owner: 'un',
          voters: 'value',
        }, undefined, { auth: undefined }, undefined)).toEqual('value');
      });
    });
    it('should throw if unauthorized', () => {
      const statuses = [
        'created',
        'inviting',
      ];
      statuses.forEach((st) => {
        expect(Ballot.voters({
          status: st,
          owner: 'un',
        }, undefined, { auth: undefined }, undefined))
          .toBeInstanceOf(errors.UnauthorizedError);
      });
    });
    it('should throw if forbidden', () => {
      const statuses = [
        'created',
        'inviting',
      ];
      statuses.forEach((st) => {
        expect(Ballot.voters({
          status: st,
          owner: 'un',
        }, undefined, { auth: { username: 'unx' } }, undefined))
          .toBeInstanceOf(errors.UnauthorizedError);
      });
    });
    it('should not throw if allowed', () => {
      const statuses = [
        'created',
        'inviting',
      ];
      statuses.forEach((st) => {
        expect(Ballot.voters({
          status: st,
          owner: 'un',
          voters: 'value',
        }, undefined, { auth: { username: 'un' } }, undefined))
          .toEqual('value');
      });
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
