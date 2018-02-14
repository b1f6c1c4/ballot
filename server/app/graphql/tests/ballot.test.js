const { models, make, mer, check } = require('../../../tests/util');
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

    it('should throw unauthorized', async (done) => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should throw name malformed', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.name', ''));
      expect(res).toBeInstanceOf(errors.NameMalformedError);
      done();
    });

    it('should not throw if error', async (done) => {
      models.Ballot.throwErrOn('save');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should save if good', async (done) => {
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(targ);
      done();
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
          ],
        },
      },
      { auth: { username: 'asdfqwer' } },
    ];
    const targ = [
      { prompt: '1', type: 'string', data: ['sd'] },
      { prompt: '2', type: 'enum', data: ['it', 'its'] },
    ];

    it('should throw unauthorized', async (done) => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should throw field type both malformed', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.fields[1].stringDefault', 'df'));
      expect(res).toBeInstanceOf(errors.FieldMalformedError);
      done();
    });

    it('should throw field type neither malformed', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.fields[2].prompt', 3));
      expect(res).toBeInstanceOf(errors.FieldMalformedError);
      done();
    });

    it('should not throw if error', async (done) => {
      models.Ballot.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should throw unauthorized if not owner', async (done) => {
      await make.Ballot(dBallot, 'owner', 'own');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      await check.Ballot(dBallot, 'owner', 'own');
      done();
    });

    it('should handle not found', async (done) => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should handle status incorrect', async (done) => {
      await make.Ballot(dBallot, 'status', 'unknown');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.StatusNotAllowedError);
      await check.Ballot(dBallot, 'status', 'unknown');
      done();
    });

    it('should save if good creating', async (done) => {
      await make.Ballot(dBallot, 'status', 'creating');
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(dBallot, 'status', 'creating', 'fields', targ);
      done();
    });

    it('should save if good inviting', async (done) => {
      await make.Ballot(dBallot, 'status', 'inviting');
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(dBallot, 'status', 'inviting', 'fields', targ);
      done();
    });

    it('should save if good invited', async (done) => {
      await make.Ballot(dBallot, 'status', 'invited');
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(dBallot, 'status', 'invited', 'fields', targ);
      done();
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

    it('should throw unauthorized', async (done) => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should throw name malformed', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.name', ''));
      expect(res).toBeInstanceOf(errors.NameMalformedError);
      done();
    });

    it('should not throw if error', async (done) => {
      models.Ballot.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should throw unauthorized if not owner', async (done) => {
      await make.Ballot(dBallot, 'owner', 'own');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should handle not found', async (done) => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should handle status incorrect', async (done) => {
      await make.Ballot(dBallot, 'status', 'unknown');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.StatusNotAllowedError);
      await check.Ballot(dBallot, 'status', 'unknown');
      done();
    });

    it('should save if good creating', async (done) => {
      await make.Ballot(dBallot, 'status', 'creating');
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(dBallot, 'status', 'creating', 'voters[1]', targ);
      done();
    });

    it('should save if good inviting', async (done) => {
      await make.Ballot(dBallot, 'status', 'inviting');
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      await check.Ballot(dBallot, 'status', 'inviting', 'voters[1]', targ);
      done();
    });
  });

  describe('deleteVoter', () => {
    const func = resolvers.Mutation.deleteVoter;
    const dArgs = [
      undefined,
      { input: { bId: '123', iCode: 'ic' } },
      { auth: { username: 'asdfqwer' } },
    ];

    it('should throw unauthorized', async (done) => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should not throw if error', async (done) => {
      models.Ballot.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should throw unauthorized if not owner', async (done) => {
      await make.Ballot(dBallot, 'owner', 'own');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should handle ballot not found', async (done) => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should handle voter not found', async (done) => {
      await make.Ballot(dBallot, 'voters[0]._id', 'xxx');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      await check.Ballot(dBallot, 'voters[0]._id', 'xxx');
      done();
    });

    it('should handle status incorrect', async (done) => {
      await make.Ballot(dBallot, 'status', 'unknown');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.StatusNotAllowedError);
      await check.Ballot(dBallot, 'status', 'unknown');
      done();
    });

    it('should save if good creating', async (done) => {
      await make.Ballot(dBallot, 'status', 'creating');
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      await check.Ballot(dBallot, 'status', 'creating', 'voters', []);
      done();
    });

    it('should save if good inviting', async (done) => {
      await make.Ballot(dBallot, 'status', 'inviting');
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      await check.Ballot(dBallot, 'status', 'inviting', 'voters', []);
      done();
    });
  });
});
