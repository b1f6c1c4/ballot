const { models, make, check } = require('../../tests/util');
const finalizeNewRing = require('../newRing');

describe('newRing', () => {
  const dBallot = {
    _id: 'val',
    status: 'creating',
    crypto: {
      h: 'evil',
    },
    fields: [],
    voters: [],
  };
  const dResCon = [
    { q: 'qval', g: 'gval' },
    { method: 'newRing', _id: 'val' },
  ];

  it('should not throw if errored', async (done) => {
    models.Ballot.throwErrOn('findOneAndUpdate');
    await finalizeNewRing(...dResCon);
    done();
  });

  it('should not change if status not match', async (done) => {
    await make.Ballot(dBallot, 'status', 'unknown');
    await finalizeNewRing(...dResCon);
    await check.Ballot(dBallot, 'status', 'unknown');
    done();
  });

  it('should change if good', async (done) => {
    await make.Ballot(dBallot);
    await finalizeNewRing(...dResCon);
    await check.Ballot(dBallot, 'status', 'inviting', 'crypto', {
      q: 'qval',
      g: 'gval',
    });
    done();
  });
});
