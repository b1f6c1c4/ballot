// const mockingoose = require('mockingoose').default;
const {
  // Query,
  Ballot,
} = require('../query');

describe('Query', () => {
  describe('ballot', () => {
    describe('with bId', () => {
      it('should query by id', () => {
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
  });
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
