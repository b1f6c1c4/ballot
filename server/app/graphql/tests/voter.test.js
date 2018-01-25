const { models, make, mer, check } = require('../../../tests/util');
const { resolvers } = require('../voter');
const errors = require('../error');

const dBallot = {
  _id: '123',
  owner: 'asdfqwer',
  status: 'inviting',
  fields: [
    { prompt: 'a', type: 't', data: ['d'] },
  ],
  voters: [
    { _id: 'icc' },
  ],
};

describe('Mutation', () => {
  describe('registerVoter', () => {
    const func = resolvers.Mutation.registerVoter;
    const dArgs = [
      undefined,
      {
        input: {
          bId: '123',
          iCode: 'icc',
          comment: 'cmt',
          publicKey: '1234',
        },
      },
      undefined,
    ];
    const targ = { _id: 'icc', comment: 'cmt', publicKey: '1234' };

    it('should throw public key malformed', async (done) => {
      const res = await func(...mer(dArgs, '[1].input.publicKey', '123'));
      expect(res).toBeInstanceOf(errors.PublicKeyMalformedError);
      done();
    });

    it('should not throw if error', async (done) => {
      models.Ballot.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should handle ballot not found', async (done) => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should handle voter not found', async (done) => {
      await make.Ballot(dBallot, 'voters[0]._id', 'ic');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      await check.Ballot(dBallot, 'voters[0]._id', 'ic');
      done();
    });

    it('should handle dup register', async (done) => {
      await make.Ballot(dBallot, 'voters[0].publicKey', 'pk');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.VoterRegisteredError);
      await check.Ballot(dBallot, 'voters[0].publicKey', 'pk');
      done();
    });

    it('should handle status incorrect', async (done) => {
      await make.Ballot(dBallot, 'status', 'unknown');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.StatusNotAllowedError);
      await check.Ballot(dBallot, 'status', 'unknown');
      done();
    });

    it('should save if good inviting', async (done) => {
      await make.Ballot(dBallot);
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      await check.Ballot(dBallot, 'voters[0]', targ);
      done();
    });
  });
});
