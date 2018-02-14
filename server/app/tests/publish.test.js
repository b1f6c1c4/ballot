const sPublish = jest.fn();
jest.doMock('../../rpc', () => ({
  sPublish,
}));

// eslint-disable-next-line global-require
const { updateBallotStatus } = require('../publish');

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

