const { connect } = require('../../mongo');
const { Ballot } = require('../../models/ballots');
const { SubmittedTicket } = require('../../models/submittedTickets');
const { SignedTicket } = require('../../models/signedTickets');
const finalizeVerify = require('../verify');
const logger = require('../../logger')('tests/verify');
const thrower = require('../../tests/mongooseThrower');

const throwBallot = thrower(Ballot);
const throwSubmittedTicket = thrower(SubmittedTicket);
const throwSignedTicket = thrower(SignedTicket);

beforeAll(async (done) => {
  logger.info('Connecting mongoose');
  await connect();
  done();
});

describe('verify', () => {
  beforeEach(async (done) => {
    await Ballot.remove({});
    await SubmittedTicket.remove({});
    await SignedTicket.remove({});
    throwBallot({});
    throwSubmittedTicket({});
    throwSignedTicket({});
    done();
  });

  afterAll(async (done) => {
    await Ballot.remove({});
    await SubmittedTicket.remove({});
    await SignedTicket.remove({});
    done();
  });

  it('should not throw if errored', async (done) => {
    throwBallot({
      findOne: new Error('Some error'),
    });
    expect.hasAssertions();
    await finalizeVerify(
      { valid: 0 },
      { method: 'verify', _id: 'ttt', bId: '123' },
    );
    done();
  });

  it('should not throw if ballot not found', async (done) => {
    throwBallot({
      findOne: false,
    });
    expect.hasAssertions();
    await finalizeVerify(
      { valid: 0 },
      { method: 'verify', _id: 'ttt', bId: '123' },
    );
    done();
  });

  it('should not throw if submitted ticket not found', async (done) => {
    const doc = new Ballot();
    doc._id = '123';
    doc.status = 'voting';
    await doc.save();
    await finalizeVerify(
      { valid: 0 },
      { method: 'verify', _id: 'ttt', bId: '123' },
    );
    const cnt = await SignedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should handle declined', async (done) => {
    const doc = new Ballot();
    doc._id = '123';
    doc.status = 'voting';
    await doc.save();
    let o = new SubmittedTicket();
    o._id = 'ttt';
    o.status = 'submitted';
    await o.save();
    await finalizeVerify(
      { valid: 0 },
      { method: 'verify', _id: 'ttt', bId: '123' },
    );
    o = await SubmittedTicket.findById('ttt');
    expect(o.status).toEqual('declined');
    const cnt = await SignedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should handle timeout', async (done) => {
    const doc = new Ballot();
    doc._id = '123';
    doc.status = 'unknown';
    await doc.save();
    let o = new SubmittedTicket();
    o._id = 'ttt';
    o.status = 'submitted';
    await o.save();
    await finalizeVerify(
      { valid: 0 },
      { method: 'verify', _id: 'ttt', bId: '123' },
    );
    o = await SubmittedTicket.findById('ttt');
    expect(o.status).toEqual('timeout');
    const cnt = await SignedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should not change unknown ticket status', async (done) => {
    const doc = new Ballot();
    doc._id = '123';
    doc.status = 'voting';
    await doc.save();
    let o = new SubmittedTicket();
    o._id = 'ttt';
    o.status = 'unknown';
    await o.save();
    await finalizeVerify(
      { valid: 0 },
      { method: 'verify', _id: 'ttt', bId: '123' },
    );
    o = await SubmittedTicket.findById('ttt');
    expect(o.status).toEqual('unknown');
    const cnt = await SignedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should handle accept', async (done) => {
    const doc = new Ballot();
    doc._id = '123';
    doc.status = 'voting';
    await doc.save();
    let o = new SubmittedTicket();
    o._id = 'ttt';
    o.status = 'submitted';
    o.ticket = {
      _id: 't',
      payload: { bId: '123', result: ['a', 'b'] },
      s: ['s'],
      c: ['c'],
    };
    await o.save();
    await finalizeVerify(
      { valid: 1 },
      { method: 'verify', _id: 'ttt', bId: '123' },
    );
    o = await SubmittedTicket.findById('ttt');
    expect(o.status).toEqual('accepted');
    const tkts = await SignedTicket.find({});
    expect(tkts.length).toEqual(1);
    expect(tkts[0]._id).toEqual('t');
    expect(tkts[0].payload.bId).toEqual('123');
    expect(tkts[0].payload.result.toObject()).toEqual(['a', 'b']);
    expect(tkts[0].s.toObject()).toEqual(['s']);
    expect(tkts[0].c.toObject()).toEqual(['c']);
    done();
  });
});
