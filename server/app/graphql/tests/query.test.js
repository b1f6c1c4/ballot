const { models, make, mer } = require('../../../tests/util');
const errors = require('../error');

jest.mock('../projection', () => ({
  project(info) {
    expect(info.key).toEqual('info');
    const obj = { _id: 0 };
    info.projs.forEach((k) => { obj[k] = 1; });
    return obj;
  },
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
const { resolvers } = require('../query');

describe('Query', () => {
  const dBallot = {
    _id: '123',
    name: 'nm',
    owner: 'asdfqwer',
    status: 'creating',
    crypto: { q: 'q', g: 'g', h: 'h' },
    fields: [
      { prompt: 'a', type: 't', data: ['d'] },
    ],
    voters: [
      { _id: 'ic' },
    ],
  };

  describe('ballot', () => {
    const func = resolvers.Query.ballot;
    const dArgs = [
      undefined,
      { input: { bId: '123' } },
      undefined,
      { key: 'info', projs: [] },
    ];

    it('should not throw if error', async (done) => {
      models.Ballot.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should handle not found', async (done) => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should throttle', async (done) => {
      throttleThrow = true;
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.TooManyRequestsError);
      done();
    });

    it('should query if good', async (done) => {
      await make.Ballot(dBallot);
      const res = await func(...mer(dArgs, '[3].projs', ['name', 'owner']));
      expect(res).toEqual({ name: 'nm', owner: 'asdfqwer' });
      done();
    });
  });

  describe('ballots', () => {
    const func = resolvers.Query.ballots;
    const dArgs = [
      undefined,
      undefined,
      { auth: { username: 'asdfqwer' } },
      { key: 'info', projs: [] },
    ];

    it('should throw unauthorized', async (done) => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should not throw if error', async (done) => {
      models.Ballot.throwErrOn('find');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should handle not found', async (done) => {
      const res = await func(...dArgs);
      expect(res).toEqual([]);
      done();
    });

    it('should throttle', async (done) => {
      throttleThrow = true;
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.TooManyRequestsError);
      done();
    });

    it('should query if good', async (done) => {
      await make.Ballot(dBallot, '_id', '1');
      await make.Ballot(dBallot, '_id', '2', 'name', 'nm2');
      await make.Ballot(dBallot, '_id', '3', 'owner', 'own');
      const res = await func(...mer(dArgs, '[3].projs', ['_id', 'name', 'owner']));
      expect(res).toEqual([
        { _id: '1', name: 'nm', owner: 'asdfqwer' },
        { _id: '2', name: 'nm2', owner: 'asdfqwer' },
      ]);
      done();
    });
  });
});

describe('Ballot', () => {
  describe('fields', () => {
    const func = resolvers.Ballot.fields;
    const dArgs = (st) => [
      { status: st, owner: 'asdfqwer', fields: 'value' },
      undefined,
      { auth: { username: 'asdfqwer' } },
      undefined,
    ];
    const statFree = [
      'preVoting',
      'voting',
      'finished',
    ];
    const statAuth = [
      'unknown',
      'creating',
      'inviting',
      'invited',
    ];

    it('should not throw if no auth required', () => {
      statFree.forEach((st) => {
        expect(func(...mer(dArgs(st), '[2].auth', {}))).toEqual('value');
      });
    });
    it('should throw if unauthorized', () => {
      statAuth.forEach((st) => {
        expect(func(...mer(dArgs(st), '[2].auth', {})))
          .toBeInstanceOf(errors.UnauthorizedError);
      });
    });
    it('should throw if forbidden', () => {
      statAuth.forEach((st) => {
        expect(func(...mer(dArgs(st), '[2].auth.username', 'unx')))
          .toBeInstanceOf(errors.UnauthorizedError);
      });
    });
    it('should not throw if allowed', () => {
      statAuth.forEach((st) => {
        expect(func(...dArgs(st))).toEqual('value');
      });
    });
  });

  describe('voters', () => {
    const func = resolvers.Ballot.voters;
    const dArgs = (st) => [
      { status: st, owner: 'asdfqwer', voters: 'value' },
      undefined,
      { auth: { username: 'asdfqwer' } },
      undefined,
    ];
    const statFree = [
      'invited',
      'preVoting',
      'voting',
      'finished',
    ];
    const statAuth = [
      'unknown',
      'creating',
      'inviting',
    ];

    it('should not throw if no auth required', () => {
      statFree.forEach((st) => {
        expect(func(...mer(dArgs(st), '[2].auth', {}))).toEqual('value');
      });
    });
    it('should throw if unauthorized', () => {
      statAuth.forEach((st) => {
        expect(func(...mer(dArgs(st), '[2].auth', {})))
          .toBeInstanceOf(errors.UnauthorizedError);
      });
    });
    it('should throw if forbidden', () => {
      statAuth.forEach((st) => {
        expect(func(...mer(dArgs(st), '[2].auth.username', 'unx')))
          .toBeInstanceOf(errors.UnauthorizedError);
      });
    });
    it('should not throw if allowed', () => {
      statAuth.forEach((st) => {
        expect(func(...dArgs(st))).toEqual('value');
      });
    });
  });
});

describe('BallotField', () => {
  const func = resolvers.BallotField.__resolveType;
  it('should classify enum', () => {
    expect(func({ type: 'enum' })).toEqual('EnumField');
  });
  it('should classify string', () => {
    expect(func({ type: 'string' })).toEqual('StringField');
  });
  it('should not classify unknown', () => {
    expect(func({ type: 'wtf' })).toBeNull();
  });
  it('should not classify undefined', () => {
    expect(func({})).toBeNull();
  });
});
