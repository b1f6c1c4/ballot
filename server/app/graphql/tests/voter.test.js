// const mockingoose = require('mockingoose').default;
const { resolvers } = require('../voter');
const errors = require('../error');

const {
  registerVoter,
} = resolvers.Mutation;

describe('Mutation', () => {
  describe('registerVoter', () => {
    it('should throw public key malformed', () => {
      expect.hasAssertions();
      return expect(registerVoter(undefined, {
        input: {
          bId: '123',
          iCode: '456',
          comment: 'cmt',
          publicKey: '123',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.PublicKeyMalformedError);
    });
    // TODO
  });
});
