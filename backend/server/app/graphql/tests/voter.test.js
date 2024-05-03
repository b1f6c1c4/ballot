const { models, make, mer, check } = require('../../../tests/bundle');
const errors = require('../error');

let throttleThrow = false;
jest.doMock('../throttle', () => () => async () => {
  if (throttleThrow) {
    throw new errors.TooManyRequestsError(666);
  }
});

beforeEach(() => {
  throttleThrow = false;
});

let updateVoterRegisteredCalled = false;

jest.doMock('../../publish', () => ({
  async updateVoterRegistered(bId, doc) {
    expect(bId).toEqual('123');
    expect(doc._id).toEqual('icc');
    updateVoterRegisteredCalled = true;
  },
}));

beforeEach(() => {
  updateVoterRegisteredCalled = false;
});

// eslint-disable-next-line global-require
const { resolvers } = require('../voter');

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

    it('should throw public key malformed', async () => {
      const res = await func(...mer(dArgs, '[1].input.publicKey', '123'));
      expect(res).toBeInstanceOf(errors.PublicKeyMalformedError);
    });

    it('should not throw if error', async () => {
      models.Ballot.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('jest-mongoose Error');
    });

    it('should handle ballot not found', async () => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
    });

    it('should handle voter not found', async () => {
      await make.Ballot(dBallot, 'voters[0]._id', 'ic');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      await check.Ballot(dBallot, 'voters[0]._id', 'ic');
    });

    it('should handle dup register', async () => {
      await make.Ballot(dBallot, 'voters[0].publicKey', 'pk');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.VoterRegisteredError);
      await check.Ballot(dBallot, 'voters[0].publicKey', 'pk');
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

    it('should save if good', async () => {
      await make.Ballot(dBallot);
      const res = await func(...dArgs);
      expect(res).toEqual(true);
      await check.Ballot(dBallot, 'voters[0]', targ);
      expect(updateVoterRegisteredCalled).toEqual(true);
    });
  });
});
