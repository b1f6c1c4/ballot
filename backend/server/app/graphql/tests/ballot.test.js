// const mockingoose = require('mockingoose').default;
const { resolvers } = require('../ballot');
const errors = require('../error');

const {
  createBallot,
  replaceFields,
  createVoter,
  deleteVoter,
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

  describe('replaceFields', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [],
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    it('should throw unauthorized if not owner', () => {
      // TODO
      // expect.hasAssertions();
      // return expect(replaceFields(undefined, {
      //   input: {
      //     bId: '123',
      //     fields: [],
      //   },
      // }, {
      //   auth: {
      //     username: 'asdfqwer',
      //   },
      // })).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    it('should throw field type both malformed', () => {
      expect.hasAssertions();
      return expect(replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [{
            prompt: '',
            stringDefault: 'sd',
            enumItems: ['it'],
          }],
        },
      }, {
        auth: {
          username: 'asdfqwer',
        },
      })).resolves.toBeInstanceOf(errors.FieldMalformedError);
    });
    it('should throw field type neither malformed', () => {
      expect.hasAssertions();
      return expect(replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [{
            prompt: '',
          }],
        },
      }, {
        auth: {
          username: 'asdfqwer',
        },
      })).resolves.toBeInstanceOf(errors.FieldMalformedError);
    });
    // TODO
  });

  describe('createVoter', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(createVoter(undefined, {
        input: {
          bId: '123',
          name: 'nm',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    it('should throw unauthorized if not owner', () => {
      // TODO
      // expect.hasAssertions();
      // return expect(createVoter(undefined, {
      //   input: {
      //     bId: '123',
      //     name: 'nm',
      //   },
      // }, {
      //   auth: {
      //     username: 'asdfqwer',
      //   },
      // })).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    // TODO
  });

  describe('deleteVoter', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(deleteVoter(undefined, {
        input: {
          bId: '123',
          name: 'nm',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    it('should throw unauthorized if not owner', () => {
      // TODO
      // expect.hasAssertions();
      // return expect(deleteVoter(undefined, {
      //   input: {
      //     bId: '123',
      //     name: 'nm',
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
