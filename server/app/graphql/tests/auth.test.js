// const mockingoose = require('mockingoose').default;
const { resolvers } = require('../auth');
const errors = require('../error');

const {
  register,
  login,
  password,
} = resolvers.Mutation;

describe('Mutation', () => {
  describe('register', () => {
    it('should throw username malformed', () => {
      expect.hasAssertions();
      return expect(register(undefined, {
        input: {
          username: 'asdfa3 eibv',
          password: '123456789',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UsernameMalformedError);
    });
    it('should throw username malformed', () => {
      expect.hasAssertions();
      return expect(register(undefined, {
        input: {
          username: '-asd3333bghhf',
          password: '123456789',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UsernameMalformedError);
    });
    it('should throw username malformed', () => {
      expect.hasAssertions();
      return expect(register(undefined, {
        input: {
          username: 'asd',
          password: '123456789',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UsernameMalformedError);
    });
    it('should throw password malformed', () => {
      expect.hasAssertions();
      return expect(register(undefined, {
        input: {
          username: 'asdfqwer',
          password: '123',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.PasswordMalformedError);
    });
    // TODO
  });
  describe('login', () => {
    it('should throw username malformed', () => {
      expect.hasAssertions();
      return expect(login(undefined, {
        input: {
          username: 'asdfa3 eibv',
          password: '123456789',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UsernameMalformedError);
    });
    it('should throw username malformed', () => {
      expect.hasAssertions();
      return expect(login(undefined, {
        input: {
          username: '-asd3333bghhf',
          password: '123456789',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UsernameMalformedError);
    });
    it('should throw username malformed', () => {
      expect.hasAssertions();
      return expect(login(undefined, {
        input: {
          username: 'asd',
          password: '123456789',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UsernameMalformedError);
    });
    it('should throw password malformed', () => {
      expect.hasAssertions();
      return expect(login(undefined, {
        input: {
          username: 'asdfqwer',
          password: '123',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.PasswordMalformedError);
    });
    // TODO
  });
  describe('password', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(password(undefined, {
        input: {
          oldPassword: '123456789',
          newPassword: '123456789',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });
    it('should throw old password malformed', () => {
      expect.hasAssertions();
      return expect(password(undefined, {
        input: {
          oldPassword: '123',
          newPassword: '123456789',
        },
      }, {
        auth: {
          username: 'asdfqwer',
        },
      })).resolves.toBeInstanceOf(errors.PasswordMalformedError);
    });
    it('should throw new password malformed', () => {
      expect.hasAssertions();
      return expect(password(undefined, {
        input: {
          oldPassword: '123456789',
          newPassword: '123',
        },
      }, {
        auth: {
          username: 'asdfqwer',
        },
      })).resolves.toBeInstanceOf(errors.PasswordMalformedError);
    });
    // TODO
  });
});

