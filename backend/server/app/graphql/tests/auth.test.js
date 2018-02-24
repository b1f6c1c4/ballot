const { models, make, mer, check } = require('../../../tests/bundle');
const errors = require('../error');

jest.mock('../../cryptor', () => ({
  hashPassword(pw) {
    expect(typeof pw).toEqual('string');
    return { hash: `${pw}xx` };
  },
  verifyPassword(pw, hs) {
    expect(typeof pw).toEqual('string');
    expect(typeof hs).toEqual('string');
    return { valid: !!hs.startsWith(pw) };
  },
}));

jest.mock('../../auth', () => ({
  issue: (payload) => payload,
}));

let throttleThrow = false;
jest.doMock('../throttle', () => () => async () => {
  if (throttleThrow) {
    throw new errors.TooManyRequestsError(666);
  }
});

beforeEach(() => {
  throttleThrow = false;
});

// eslint-disable-next-line global-require
const { resolvers } = require('../auth');

describe('Mutation', () => {
  const dOrganizer = {
    _id: 'asdfqwer',
    hash: '66666666yy',
  };

  describe('register', () => {
    const func = resolvers.Mutation.register;
    const dArgs = [
      undefined,
      { input: { username: 'asdfqwer', password: '66666666' } },
      undefined,
    ];

    it('should throw username malformed 1', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.username', 'asdfa3 eibv'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw username malformed 2', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.username', '-asd3333bghhf'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw username malformed 3', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.username', 'asd'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw password malformed', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.password', '123'));
      expect(res).toBeInstanceOf(errors.PasswordMalformedError);
      done();
    });

    it('should not throw if errored', async (done) => {
      models.Organizer.throwErrOn('save');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('jest-mongoose Error');
      done();
    });

    it('should handle username exists', async (done) => {
      await make.Organizer(dOrganizer);
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.UsernameExistsError);
      await check.Organizer(dOrganizer);
      done();
    });

    it('should throttle', async (done) => {
      throttleThrow = true;
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.TooManyRequestsError);
      done();
    });

    it('should save if good', async (done) => {
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      await check.Organizer({
        _id: 'asdfqwer',
        hash: '66666666xx',
      });
      done();
    });
  });

  describe('login', () => {
    const func = resolvers.Mutation.login;
    const dArgs = [
      undefined,
      { input: { username: 'asdfqwer', password: '66666666' } },
      undefined,
    ];

    it('should throw username malformed 1', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.username', 'asdfa3 eibv'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw username malformed 2', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.username', '-asd3333bghhf'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw username malformed 3', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.username', 'asd'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw password malformed', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.password', '123'));
      expect(res).toBeInstanceOf(errors.PasswordMalformedError);
      done();
    });

    it('should not throw if errored', async (done) => {
      models.Organizer.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('jest-mongoose Error');
      done();
    });

    it('should handle user not found', async (done) => {
      const res = await func(...dArgs);
      expect(res).toBeNull();
      done();
    });

    it('should handle password wrong', async (done) => {
      await make.Organizer(dOrganizer);
      const res = await func(...mer(dArgs, '[1].input.password', '123456789'));
      expect(res).toBeNull();
      done();
    });

    it('should throttle', async (done) => {
      throttleThrow = true;
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.TooManyRequestsError);
      done();
    });

    it('should issue token if good', async (done) => {
      await make.Organizer(dOrganizer);
      const res = await func(...dArgs);
      expect(res).toEqual({ username: 'asdfqwer' });
      done();
    });
  });

  describe('password', () => {
    const func = resolvers.Mutation.password;
    const dArgs = [
      undefined,
      { input: { oldPassword: '66666666', newPassword: '123456789' } },
      { auth: { username: 'asdfqwer' } },
    ];

    it('should throw unauthorized', async (done) => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should throw old password malformed', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.oldPassword', '123'));
      expect(res).toBeInstanceOf(errors.PasswordMalformedError);
      done();
    });

    it('should throw new password malformed', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.newPassword', '123'));
      expect(res).toBeInstanceOf(errors.PasswordMalformedError);
      done();
    });

    it('should not throw if errored', async (done) => {
      models.Organizer.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('jest-mongoose Error');
      done();
    });

    it('should handle user not found', async (done) => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should handle password wrong', async (done) => {
      await make.Organizer(dOrganizer);
      const res = await func(...mer(dArgs, '[1].input.oldPassword', '77777777'));
      expect(res).toEqual(false);
      await check.Organizer(dOrganizer);
      done();
    });

    it('should throttle', async (done) => {
      throttleThrow = true;
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.TooManyRequestsError);
      done();
    });

    it('should handle password correct', async (done) => {
      await make.Organizer(dOrganizer);
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      await check.Organizer(dOrganizer, 'hash', '123456789xx');
      done();
    });
  });
});
