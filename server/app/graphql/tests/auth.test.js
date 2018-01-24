const { connect } = require('../../../mongo');
const { Organizer } = require('../../../models/organizers');
const errors = require('../error');
const logger = require('../../../logger')('tests/graphql/auth');
const thrower = require('../../../tests/mongooseThrower');

const throwOrganizer = thrower(Organizer);

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

beforeAll(async (done) => {
  logger.info('Connecting mongoose');
  await connect();
  done();
});

describe('Mutation', () => {
  beforeEach(async (done) => {
    await Organizer.remove({});
    throwOrganizer({});
    done();
  });

  afterAll(async (done) => {
    await Organizer.remove({});
    done();
  });

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

    it('should not throw if errored', async (done) => {
      throwOrganizer({
        save: new Error('Some error'),
      });
      expect.hasAssertions();
      const res = await register(undefined, {
        input: {
          username: 'asdfqwer',
          password: '123456789',
        },
      }, undefined);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should handle username exists', async (done) => {
      let doc = new Organizer();
      doc._id = 'asdfqwer';
      doc.hash = '66666666yy';
      doc.salt = 'yy';
      await doc.save();
      expect.hasAssertions();
      const res = await register(undefined, {
        input: {
          username: 'asdfqwer',
          password: '123456789',
        },
      }, undefined);
      expect(res).toBeInstanceOf(errors.UsernameExistsError);
      doc = await Organizer.findById('asdfqwer');
      expect(doc.hash).toEqual('66666666yy');
      expect(doc.salt).toEqual('yy');
      done();
    });

    it('should save if good', async (done) => {
      expect.hasAssertions();
      const res = await register(undefined, {
        input: {
          username: 'asdfqwer',
          password: '123456789',
        },
      }, undefined);
      expect(res).toEqual(true);
      const doc = await Organizer.findById('asdfqwer');
      expect(doc.hash).toEqual('123456789xx');
      expect(doc.salt).toEqual('xx');
      done();
    });
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

    it('should not throw if errored', async (done) => {
      throwOrganizer({
        findOne: new Error('Some error'),
      });
      expect.hasAssertions();
      const res = await login(undefined, {
        input: {
          username: 'asdfqwer',
          password: '123456789',
        },
      }, undefined);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should handle user not found', async (done) => {
      expect.hasAssertions();
      const res = await login(undefined, {
        input: {
          username: 'asdfqwer',
          password: '123456789',
        },
      }, undefined);
      expect(res).toBeNull();
      done();
    });

    it('should handle password wrong', async (done) => {
      const doc = new Organizer();
      doc._id = 'asdfqwer';
      doc.hash = '66666666yy';
      doc.salt = 'yy';
      await doc.save();
      expect.hasAssertions();
      const res = await login(undefined, {
        input: {
          username: 'asdfqwer',
          password: '123456789',
        },
      }, undefined);
      expect(res).toBeNull();
      done();
    });

    it('should issue token if good', async (done) => {
      const doc = new Organizer();
      doc._id = 'asdfqwer';
      doc.hash = '66666666yy';
      doc.salt = 'yy';
      await doc.save();
      expect.hasAssertions();
      const res = await login(undefined, {
        input: {
          username: 'asdfqwer',
          password: '66666666',
        },
      }, undefined);
      expect(res).toEqual({ username: 'asdfqwer' });
      done();
    });
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
        auth: { username: 'asdfqwer' },
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
        auth: { username: 'asdfqwer' },
      })).resolves.toBeInstanceOf(errors.PasswordMalformedError);
    });

    it('should not throw if errored', async (done) => {
      throwOrganizer({
        findOne: new Error('Some error'),
      });
      expect.hasAssertions();
      const res = await password(undefined, {
        input: {
          oldPassword: '123456789',
          newPassword: '987654321',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should handle user not found', async (done) => {
      expect.hasAssertions();
      const res = await password(undefined, {
        input: {
          oldPassword: '123456789',
          newPassword: '987654321',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should handle password wrong', async (done) => {
      let doc = new Organizer();
      doc._id = 'asdfqwer';
      doc.hash = '66666666yy';
      doc.salt = 'yy';
      await doc.save();
      expect.hasAssertions();
      const res = await password(undefined, {
        input: {
          oldPassword: '123456789',
          newPassword: '987654321',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toEqual(false);
      doc = await Organizer.findById('asdfqwer');
      expect(doc.hash).toEqual('66666666yy');
      expect(doc.salt).toEqual('yy');
      done();
    });

    it('should handle password correct', async (done) => {
      let doc = new Organizer();
      doc._id = 'asdfqwer';
      doc.hash = '66666666yy';
      doc.salt = 'yy';
      await doc.save();
      expect.hasAssertions();
      const res = await password(undefined, {
        input: {
          oldPassword: '66666666',
          newPassword: '987654321',
        },
      }, {
        auth: { username: 'asdfqwer' },
      }, undefined);
      expect(res).toEqual(true);
      doc = await Organizer.findById('asdfqwer');
      expect(doc.hash).toEqual('987654321xx');
      expect(doc.salt).toEqual('xx');
      done();
    });
  });
});
