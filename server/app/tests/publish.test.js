const sPublish = jest.fn();
jest.doMock('../../rpc', () => ({
  sPublish,
}));

// eslint-disable-next-line global-require
const {
  updateBallotStatus,
  updateVoterRegistered,
} = require('../publish');

describe('updateBallotStatus', () => {
  it('should publish', (done) => {
    expect.hasAssertions();
    sPublish.mockImplementationOnce((k, status) => {
      expect(k).toEqual('status.ow.i');
      expect(status).toEqual('st');
      done();
    });
    updateBallotStatus({ _id: 'i', owner: 'ow', status: 'st' });
  });
});

describe('updateVoterRegistered', () => {
  it('should publish', (done) => {
    expect.hasAssertions();
    sPublish.mockImplementationOnce((k, status) => {
      expect(k).toEqual('vreg.id.ic');
      expect(JSON.parse(status)).toEqual({
        comment: 'cm',
        publicKey: 'pk',
      });
      done();
    });
    updateVoterRegistered('id', {
      _id: 'ic',
      comment: 'cm',
      publicKey: 'pk',
    });
  });
});
