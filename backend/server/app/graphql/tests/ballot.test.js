const { models, make, mer, check } = require('../../../tests/bundle');
const errors = require('../error');

jest.doMock('../../cryptor', () => ({
  bIdGen: () => 'bbb',
  iCodeGen: () => 'icc',
  async newRing(doc) {
    expect(doc).toBeInstanceOf(models.Ballot);
    expect(doc._id).toEqual('bbb');
  },
}));

jest.mock('../../auth', () => ({
  issue: (payload) => payload,
}));

let updateBallotStatusCalled = false;

jest.doMock('../../publish', () => ({
  async updateBallotStatus(doc) {
    expect(doc).toBeInstanceOf(models.Ballot);
    expect(doc._id).toEqual('bbb');
    updateBallotStatusCalled = true;
  },
}));

beforeEach(() => {
  updateBallotStatusCalled = false;
});

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
const { resolvers } = require('../ballot');

const dBallot = {
  _id: '123',
  owner: 'asdfqwer',
  status: 'creating',
  fields: [
    { prompt: 'a', type: 't', data: ['d'] },
  ],
  voters: [
    { _id: 'ic' },
  ],
};

describe('Mutation', () => {
  describe('createBallot', () => {
    const func = resolvers.Mutation.createBallot;
    const dArgs = [
      undefined,
      { input: { name: 'nm' } },
      { auth: { username: 'asdfqwer' } },
    ];
    const targ = {
      _id: 'bbb',
      name: 'nm',
      owner: 'asdfqwer',
      status: 'creating',
      fields: [],
      voters: [],
    };

    it('should throw unauthorized', async () => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
    });

    it('should throw name malformed', async () => {
      const res = await func(...mer(dArgs, '[1].input.name', ''));
      expect(res).toBeInstanceOf(errors.NameMalformedError);
    });

    it('should not throw if error', async () => {
      models.Ballot.throwErrOn('save');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('jest-mongoose Error');
    });

    it('should throttle', async () => {
      throttleThrow = true;
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.TooManyRequestsError);
    });

    it('should save if good', async () => {
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      expect(updateBallotStatusCalled).toEqual(true);
      await check.Ballot(targ);
    });
  });

  describe('replaceFields', () => {
    const func = resolvers.Mutation.replaceFields;
    const dArgs = [
      undefined,
      {
        input: {
          bId: '123',
          fields: [
            { prompt: '1', stringDefault: 'sd' },
            { prompt: '2', enumItems: ['it', 'its'] },
            { prompt: '3' },
          ],
        },
      },
      { auth: { username: 'asdfqwer' } },
    ];
    const targ = [
      { prompt: '1', type: 'string', data: ['sd'] },
      { prompt: '2', type: 'enum', data: ['it', 'its'] },
      { prompt: '3', type: 'string', data: [null] },
    ];

    it('should throw unauthorized', async () => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
    });

    it('should throw field type both malformed', async () => {
      const res = await func(...mer(dArgs, '[1].input.fields[1].stringDefault', 'df'));
      expect(res).toBeInstanceOf(errors.FieldMalformedError);
    });

    it('should not throw if error', async () => {
      models.Ballot.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('jest-mongoose Error');
    });

    it('should throw unauthorized if not owner', async () => {
      await make.Ballot(dBallot, 'owner', 'own');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      await check.Ballot(dBallot, 'owner', 'own');
    });

    it('should handle not found', async () => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
    });

    it('should handle status incorrect', async () => {
      await make.Ballot(dBallot, 'status', 'unknown');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.StatusNotAllowedError);
      await check.Ballot(dBallot, 'status', 'unknown');
    });

    it('should save if good creating', async () => {
      await make.Ballot(dBallot, 'status', 'creating');
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(dBallot, 'status', 'creating', 'fields', targ);
    });

    it('should save if good inviting', async () => {
      await make.Ballot(dBallot, 'status', 'inviting');
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(dBallot, 'status', 'inviting', 'fields', targ);
    });

    it('should save if good invited', async () => {
      await make.Ballot(dBallot, 'status', 'invited');
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(dBallot, 'status', 'invited', 'fields', targ);
    });
  });

  describe('createVoter', () => {
    const func = resolvers.Mutation.createVoter;
    const dArgs = [
      undefined,
      { input: { bId: '123', name: 'nm' } },
      { auth: { username: 'asdfqwer' } },
    ];
    const targ = { _id: 'icc', name: 'nm' };

    it('should throw unauthorized', async () => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
    });

    it('should throw name malformed', async () => {
      const res = await func(...mer(dArgs, '[1].input.name', ''));
      expect(res).toBeInstanceOf(errors.NameMalformedError);
    });

    it('should not throw if error', async () => {
      models.Ballot.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('jest-mongoose Error');
    });

    it('should throw unauthorized if not owner', async () => {
      await make.Ballot(dBallot, 'owner', 'own');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
    });

    it('should handle not found', async () => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
    });

    it('should handle status incorrect', async () => {
      await make.Ballot(dBallot, 'status', 'unknown');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.StatusNotAllowedError);
      await check.Ballot(dBallot, 'status', 'unknown');
    });

    it('should throttle', async () => {
      throttleThrow = true;
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.TooManyRequestsError);
    });

    it('should save if good creating', async () => {
      await make.Ballot(dBallot, 'status', 'creating');
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(dBallot, 'status', 'creating', 'voters[1]', targ);
    });

    it('should save if good inviting', async () => {
      await make.Ballot(dBallot, 'status', 'inviting');
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(dBallot, 'status', 'inviting', 'voters[1]', targ);
    });
  });

  describe('deleteVoter', () => {
    const func = resolvers.Mutation.deleteVoter;
    const dArgs = [
      undefined,
      { input: { bId: '123', iCode: 'ic' } },
      { auth: { username: 'asdfqwer' } },
    ];

    it('should throw unauthorized', async () => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
    });

    it('should not throw if error', async () => {
      models.Ballot.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('jest-mongoose Error');
    });

    it('should throw unauthorized if not owner', async () => {
      await make.Ballot(dBallot, 'owner', 'own');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
    });

    it('should handle ballot not found', async () => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
    });

    it('should handle voter not found', async () => {
      await make.Ballot(dBallot, 'voters[0]._id', 'xxx');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      await check.Ballot(dBallot, 'voters[0]._id', 'xxx');
    });

    it('should handle status incorrect', async () => {
      await make.Ballot(dBallot, 'status', 'unknown');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.StatusNotAllowedError);
      await check.Ballot(dBallot, 'status', 'unknown');
    });

    it('should save if good creating', async () => {
      await make.Ballot(dBallot, 'status', 'creating');
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      await check.Ballot(dBallot, 'status', 'creating', 'voters', []);
    });

    it('should save if good inviting', async () => {
      await make.Ballot(dBallot, 'status', 'inviting');
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      await check.Ballot(dBallot, 'status', 'inviting', 'voters', []);
    });
  });
});
