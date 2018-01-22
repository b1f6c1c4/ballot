// const mockingoose = require('mockingoose').default;
const { resolvers } = require('../ballot');
const errors = require('../error');

const {
  createBallot,
} = resolvers.Mutation;

describe('Mutation', () => {
  describe('createBallot', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(createBallot(undefined, {
        input: {
          name: 'a',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    it('should throw name malformed', () => {
      expect.hasAssertions();
      return expect(createBallot(undefined, {
        input: {
          name: '',
        },
      }, {
        auth: {
          username: 'asdfqwer',
        },
      })).resolves.toBeInstanceOf(errors.NameMalformedError);
    });
    // TODO
  });
});
