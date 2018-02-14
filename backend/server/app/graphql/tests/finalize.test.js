const { models, make, mer, check } = require('../../../tests/util');
const errors = require('../error');

jest.doMock('../../cryptor', () => ({
  async genH(doc) {
    expect(doc).toBeInstanceOf(models.Ballot);
    expect(doc._id).toEqual('123');
    return { h: 'hhh' };
  },
}));

let updateBallotStatusCalled = false;

jest.doMock('../../publish', () => ({
  async updateBallotStatus(doc) {
    expect(doc).toBeInstanceOf(models.Ballot);
    expect(doc._id).toEqual('123');
    updateBallotStatusCalled = true;
  },
}));

beforeEach(() => {
  updateBallotStatusCalled = false;
});

// eslint-disable-next-line global-require
const { resolvers } = require('../finalize');

const dBallotRoot = {
  _id: '123',
  owner: 'asdfqwer',
  status: 'unknown',
  crypto: { q: 'q', g: 'g' },
  fields: [
    { prompt: 'a', type: 't', data: ['d'] },
  ],
  voters: [
    { _id: 'icc', comment: 'cmt', publicKey: 'pk' },
  ],
};

describe('Mutation', () => {
  describe('finalizeFields', () => {
    const func = resolvers.Mutation.finalizeFields;
    const dArgs = [
      undefined,
      { input: { bId: '123' } },
      { auth: { username: 'asdfqwer' } },
    ];
    const dBallot = mer(dBallotRoot, 'status', 'invited');

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

    it('should save if good', async (done) => {
      await make.Ballot(dBallot);
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      expect(updateBallotStatusCalled).toEqual(true);
      await check.Ballot(dBallot, 'status', 'preVoting');
      done();
    });
  });

  describe('finalizeVoters', () => {
    const func = resolvers.Mutation.finalizeVoters;
    const dArgs = [
      undefined,
      { input: { bId: '123' } },
      { auth: { username: 'asdfqwer' } },
    ];
    const dBallot = mer(dBallotRoot, 'status', 'inviting');

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

    it('should save if good', async (done) => {
      await make.Ballot(dBallot);
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      expect(updateBallotStatusCalled).toEqual(true);
      await check.Ballot(dBallot, 'status', 'invited', 'crypto.h', 'hhh');
      done();
    });
  });

  describe('finalizePreVoting', () => {
    const func = resolvers.Mutation.finalizePreVoting;
    const dArgs = [
      undefined,
      { input: { bId: '123' } },
      { auth: { username: 'asdfqwer' } },
    ];
    const dBallot = mer(dBallotRoot, 'status', 'preVoting');

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

    it('should save if good', async (done) => {
      await make.Ballot(dBallot);
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      expect(updateBallotStatusCalled).toEqual(true);
      await check.Ballot(dBallot, 'status', 'voting');
      done();
    });
  });

  describe('finalizeVoting', () => {
    const func = resolvers.Mutation.finalizeVoting;
    const dArgs = [
      undefined,
      { input: { bId: '123' } },
      { auth: { username: 'asdfqwer' } },
    ];
    const dBallot = mer(dBallotRoot, 'status', 'voting');

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

    it('should save if good', async (done) => {
      await make.Ballot(dBallot);
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      expect(updateBallotStatusCalled).toEqual(true);
      await check.Ballot(dBallot, 'status', 'finished');
      done();
    });
  });
});
