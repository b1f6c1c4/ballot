const { models, make, mer, check } = require('../../../tests/util');
const errors = require('../error');

jest.mock('../../cryptor', () => ({
  argon2i(pw, st) {
    expect(typeof pw).toEqual('string');
    if (st) {
      expect(typeof st).toEqual('string');
      return { hash: pw + st, salt: st };
    }
    return { hash: `${pw}xx`, salt: 'xx' };
  },
}));

jest.mock('../../auth', () => ({
  issue: (payload) => payload,
}));

// eslint-disable-next-line global-require
const { resolvers } = require('../auth');

const {
  register,
  login,
  password,
} = resolvers.Mutation;

describe('Mutation', () => {
  const dOrganizer = {
    _id: 'asdfqwer',
    hash: '66666666yy',
    salt: 'yy',
  };

  describe('register', () => {
    const dArgs = [
      undefined,
      { input: { username: 'asdfqwer', password: '66666666' } },
      undefined,
    ];

    it('should throw username malformed 1', async (done) => {
      const res = await register(...mer(dArgs, '[1].input.username', 'asdfa3 eibv'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw username malformed 2', async (done) => {
      const res = await register(...mer(dArgs, '[1].input.username', '-asd3333bghhf'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw username malformed 3', async (done) => {
      const res = await register(...mer(dArgs, '[1].input.username', 'asd'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw password malformed', async (done) => {
      const res = await register(...mer(dArgs, '[1].input.password', '123'));
      expect(res).toBeInstanceOf(errors.PasswordMalformedError);
      done();
    });

    it('should not throw if errored', async (done) => {
      models.Organizer.throwErrOn('save');
      const res = await register(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should handle username exists', async (done) => {
      await make.Organizer(dOrganizer);
      const res = await register(...dArgs);
      expect(res).toBeInstanceOf(errors.UsernameExistsError);
      await check.Organizer(dOrganizer);
      done();
    });

    it('should save if good', async (done) => {
      const res = await register(...dArgs);
      expect(res).toEqual(true);
      await check.Organizer({
        _id: 'asdfqwer',
        hash: '66666666xx',
        salt: 'xx',
      });
      done();
    });
  });

  describe('login', () => {
    const dArgs = [
      undefined,
      { input: { username: 'asdfqwer', password: '66666666' } },
      undefined,
    ];

    it('should throw username malformed 1', async (done) => {
      const res = await login(...mer(dArgs, '[1].input.username', 'asdfa3 eibv'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw username malformed 2', async (done) => {
      const res = await login(...mer(dArgs, '[1].input.username', '-asd3333bghhf'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw username malformed 3', async (done) => {
      const res = await login(...mer(dArgs, '[1].input.username', 'asd'));
      expect(res).toBeInstanceOf(errors.UsernameMalformedError);
      done();
    });

    it('should throw password malformed', async (done) => {
      const res = await login(...mer(dArgs, '[1].input.password', '123'));
      expect(res).toBeInstanceOf(errors.PasswordMalformedError);
      done();
    });

    it('should not throw if errored', async (done) => {
      models.Organizer.throwErrOn('findOne');
      const res = await login(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should handle user not found', async (done) => {
      const res = await login(...dArgs);
      expect(res).toBeNull();
      done();
    });

    it('should handle password wrong', async (done) => {
      await make.Organizer(dOrganizer);
      const res = await login(...mer(dArgs, '[1].input.password', '123456789'));
      expect(res).toBeNull();
      done();
    });

    it('should issue token if good', async (done) => {
      await make.Organizer(dOrganizer);
      const res = await login(...dArgs);
      expect(res).toEqual({ username: 'asdfqwer' });
      done();
    });
  });

  describe('password', () => {
    const dArgs = [
      undefined,
      { input: { oldPassword: '66666666', newPassword: '123456789' } },
      { auth: { username: 'asdfqwer' } },
    ];

    it('should throw unauthorized', async (done) => {
      const res = await password(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should throw old password malformed', async (done) => {
      const res = await password(...mer(dArgs, '[1].input.oldPassword', '123'));
      expect(res).toBeInstanceOf(errors.PasswordMalformedError);
      done();
    });

    it('should throw new password malformed', async (done) => {
      const res = await password(...mer(dArgs, '[1].input.newPassword', '123'));
      expect(res).toBeInstanceOf(errors.PasswordMalformedError);
      done();
    });

    it('should not throw if errored', async (done) => {
      models.Organizer.throwErrOn('findOne');
      const res = await password(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should handle user not found', async (done) => {
      const res = await password(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should handle password wrong', async (done) => {
      await make.Organizer(dOrganizer);
      const res = await password(...mer(dArgs, '[1].input.oldPassword', '77777777'));
      expect(res).toEqual(false);
      await check.Organizer(dOrganizer);
      done();
    });

    it('should handle password correct', async (done) => {
      await make.Organizer(dOrganizer);
      const res = await password(...dArgs);
      expect(res).toEqual(true);
      await check.Organizer(dOrganizer, 'hash', '123456789xx', 'salt', 'xx');
      done();
    });
  });
});
