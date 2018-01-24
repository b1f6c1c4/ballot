const { connect } = require('../../mongo');
const { Ballot } = require('../../models/ballots');
const finalizeNewRing = require('../newRing');
const logger = require('../../logger')('tests/newRing');
const thrower = require('../../tests/mongooseThrower');

const throwBallot = thrower(Ballot);

beforeAll(async (done) => {
  logger.info('Connecting mongoose');
  await connect();
  done();
});

describe('newRing', () => {
  beforeEach(async (done) => {
    await Ballot.remove({});
    throwBallot({});
    done();
  });

  afterAll(async (done) => {
    await Ballot.remove({});
    done();
  });

  it('should not throw if errored', async (done) => {
    throwBallot({
      findOneAndUpdate: new Error('Some error'),
    });
    expect.hasAssertions();
    await finalizeNewRing(
      { q: 'qval', g: 'gval' },
      { method: 'newRing', _id: 'val' },
    );
    done();
  });

  it('should not change if status not match', async (done) => {
    let doc = new Ballot();
    doc._id = 'val';
    doc.status = 'unknown';
    await doc.save();
    await finalizeNewRing(
      { q: 'qval', g: 'gval' },
      { method: 'newRing', _id: 'val' },
    );
    doc = await Ballot.findById('val');
    expect(doc.status).toEqual('unknown');
    expect(doc.crypto).toBeUndefined();
    done();
  });

  it('should change if good', async (done) => {
    let doc = new Ballot();
    doc._id = 'val';
    doc.status = 'creating';
    doc.crypto = { h: 'evil' };
    await doc.save();
    await finalizeNewRing(
      { q: 'qval', g: 'gval' },
      { method: 'newRing', _id: 'val' },
    );
    doc = await Ballot.findById('val');
    expect(doc.status).toEqual('inviting');
    expect(doc.crypto.toObject()).toEqual({ q: 'qval', g: 'gval' });
    done();
  });
});
