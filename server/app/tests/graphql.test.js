jest.mock('../../status', () => ({
  key: 'value',
}));
// eslint-disable-next-line global-require
const { resolvers } = require('../graphql');

describe('Query', () => {
  describe('status', () => {
    it('should return status', () => {
      expect(resolvers.Query.status()).toEqual({
        key: 'value',
      });
    });
  });
});
