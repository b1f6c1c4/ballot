// const mockingoose = require('mockingoose').default;
const { resolvers } = require('../finalize');
const errors = require('../error');

const {
  finalizeFields,
  finalizeVoters,
} = resolvers.Mutation;

describe('Mutation', () => {
  describe('finalizeFields', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(finalizeFields(undefined, {
        input: {
          bId: '123',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    it('should throw unauthorized if not owner', () => {
      // TODO
      // expect.hasAssertions();
      // return expect(finalizeFields(undefined, {
      //   input: {
      //     bId: '123',
      //   },
      // }, {
      //   auth: {
      //     username: 'asdfqwer',
      //   },
      // })).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    // TODO
  });
  describe('finalizeVoters', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(finalizeVoters(undefined, {
        input: {
          bId: '123',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    it('should throw unauthorized if not owner', () => {
      // TODO
      // expect.hasAssertions();
      // return expect(finalizeVoters(undefined, {
      //   input: {
      //     bId: '123',
      //   },
      // }, {
      //   auth: {
      //     username: 'asdfqwer',
      //   },
      // })).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    // TODO
  });
});
