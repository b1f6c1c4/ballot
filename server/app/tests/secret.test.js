const { connect } = require('../../mongo');
const { Ballot } = require('../../models/ballots');
const { SubmittedTicket } = require('../../models/submittedTickets');
const logger = require('../../logger')('tests/secret');
const thrower = require('../../tests/mongooseThrower');

const throwBallot = thrower(Ballot);
const throwSubmittedTicket = thrower(SubmittedTicket);

const verify = jest.fn();
jest.doMock('../cryptor', () => ({
  tIdGen: () => 'ttt',
  verify,
}));

// eslint-disable-next-line global-require
const {
  errors,
  submitTicket,
  checkTicket,
} = require('../secret');

beforeAll(async (done) => {
  logger.info('Connecting mongoose');
  await connect();
  done();
});

beforeEach(async (done) => {
  await Ballot.remove({});
  await SubmittedTicket.remove({});
  throwBallot({});
  throwSubmittedTicket({});
  done();
});

afterAll(async (done) => {
  await Ballot.remove({});
  await SubmittedTicket.remove({});
  done();
});

describe('submitTicket', () => {
  it('should malform extra field', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
      key: null,
    })).resolves.toBe(errors.tkmf);
  });

  it('should malform extra payload', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
        key: null,
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.tkmf);
  });

  it('should malform t', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.tkmf);
  });

  it('should malform payload', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: 888,
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.tkmf);
  });

  it('should malform payload arr', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: [],
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.tkmf);
  });

  it('should malform bId', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cD',
        result: ['a', 'b'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.ntfd);
  });

  it('should malform result', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: {},
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.tkmf);
  });

  it('should malform s', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
      },
      s: ['56ef', '78Ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.tkmf);
  });

  it('should malform c', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', undefined, '12ef'],
    })).resolves.toBe(errors.tkmf);
  });

  it('should not throw but 500', async (done) => {
    throwBallot({
      findOne: new Error('Some error'),
    });
    expect.hasAssertions();
    const res = await submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    });
    expect(res.status).toBe(500);
    done();
  });

  it('should not found', async (done) => {
    expect.hasAssertions();
    const res = await submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    });
    expect(res).toBe(errors.ntfd);
    done();
  });

  it('should malform result length', async (done) => {
    expect.hasAssertions();
    const doc = new Ballot();
    doc._id = '34cd';
    doc.status = 'voting';
    doc.fields = [
      { type: 'string' },
      { type: 'enum', data: ['e1', 'e2'] },
    ];
    doc.voters = [{}, {}];
    await doc.save();
    const res = await submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    });
    expect(res).toBe(errors.rsmf);
    const cnt = await SubmittedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should malform s length', async (done) => {
    expect.hasAssertions();
    const doc = new Ballot();
    doc._id = '34cd';
    doc.status = 'voting';
    doc.fields = [
      { type: 'string' },
      { type: 'enum', data: ['e1', 'e2'] },
    ];
    doc.voters = [{}, {}];
    await doc.save();
    const res = await submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'e2'],
      },
      s: ['56ef'],
      c: ['90cd', '12ef'],
    });
    expect(res).toBe(errors.tkmf);
    const cnt = await SubmittedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should malform c length', async (done) => {
    expect.hasAssertions();
    const doc = new Ballot();
    doc._id = '34cd';
    doc.status = 'voting';
    doc.fields = [
      { type: 'string' },
      { type: 'enum', data: ['e1', 'e2'] },
    ];
    doc.voters = [{}, {}];
    await doc.save();
    const res = await submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'e2'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd'],
    });
    expect(res).toBe(errors.tkmf);
    const cnt = await SubmittedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should malform result type', async (done) => {
    expect.hasAssertions();
    const doc = new Ballot();
    doc._id = '34cd';
    doc.status = 'voting';
    doc.fields = [
      { type: 'string' },
      { type: 'enum', data: ['e1', 'e2'] },
    ];
    doc.voters = [{}, {}];
    await doc.save();
    const res = await submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: [1, 'e2'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    });
    expect(res).toBe(errors.rsmf);
    const cnt = await SubmittedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should malform result enum', async (done) => {
    expect.hasAssertions();
    const doc = new Ballot();
    doc._id = '34cd';
    doc.status = 'voting';
    doc.fields = [
      { type: 'string' },
      { type: 'enum', data: ['e1', 'e2'] },
    ];
    doc.voters = [{}, {}];
    await doc.save();
    const res = await submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'e3'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    });
    expect(res).toBe(errors.rsmf);
    const cnt = await SubmittedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should malform result unknown type', async (done) => {
    expect.hasAssertions();
    const doc = new Ballot();
    doc._id = '34cd';
    doc.status = 'voting';
    doc.fields = [
      { type: 'unknown' },
      { type: 'enum', data: ['e1', 'e2'] },
    ];
    doc.voters = [{}, {}];
    await doc.save();
    const res = await submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'e2'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    });
    expect(res).toBe(errors.rsmf);
    const cnt = await SubmittedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should not voting', async (done) => {
    expect.hasAssertions();
    const doc = new Ballot();
    doc._id = '34cd';
    doc.status = 'unknown';
    doc.fields = [
      { type: 'string' },
      { type: 'enum', data: ['e1', 'e2'] },
    ];
    doc.voters = [{}, {}];
    await doc.save();
    const res = await submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'e2'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    });
    expect(res).toBe(errors.stna);
    const cnt = await SubmittedTicket.count();
    expect(cnt).toEqual(0);
    done();
  });

  it('should create if good', async (done) => {
    expect.hasAssertions();
    const doc = new Ballot();
    doc._id = '34cd';
    doc.status = 'voting';
    doc.fields = [
      { type: 'string' },
      { type: 'enum', data: ['e1', 'e2'] },
    ];
    doc.voters = [{}, {}];
    await doc.save();
    const res = await submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'e2'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    });
    expect(res.status).toEqual(202);
    expect(res.json).toEqual({ tId: 'ttt' });
    const tks = await SubmittedTicket.find();
    expect(tks.length).toEqual(1);
    expect(tks[0]._id).toEqual('ttt');
    expect(tks[0].status).toEqual('submitted');
    expect(tks[0].ticket.payload.bId).toEqual('34cd');
    expect(tks[0].ticket.payload.result.toObject()).toEqual(['a', 'e2']);
    expect(tks[0].ticket.s.toObject()).toEqual(['56ef', '78ab']);
    expect(tks[0].ticket.c.toObject()).toEqual(['90cd', '12ef']);
    expect(verify.mock.calls.length).toEqual(1);
    expect(verify.mock.calls[0][0]).toBeInstanceOf(Ballot);
    expect(verify.mock.calls[0][0]._id).toEqual('34cd');
    expect(verify.mock.calls[0][1]).toBeInstanceOf(SubmittedTicket);
    expect(verify.mock.calls[0][1]._id).toEqual('ttt');
    done();
  });
});

describe('checkTicket', () => {
  it('should malform tId', () => {
    expect.hasAssertions();
    return expect(checkTicket('123')).resolves.toBe(errors.ntfd);
  });

  it('should not found', async (done) => {
    expect.hasAssertions();
    const res = await checkTicket('1234');
    expect(res).toBe(errors.ntfd);
    done();
  });

  it('should handle error', async (done) => {
    throwSubmittedTicket({
      findOne: new Error('Some error'),
    });
    expect.hasAssertions();
    const res = await checkTicket('1234');
    expect(res.status).toEqual(500);
    done();
  });

  it('should handle unknown', async (done) => {
    expect.hasAssertions();
    const doc = new SubmittedTicket();
    doc._id = '1234';
    doc.status = 'unknown';
    await doc.save();
    const res = await checkTicket('1234');
    expect(res.status).toEqual(500);
    done();
  });

  it('should handle submitted', async (done) => {
    expect.hasAssertions();
    const doc = new SubmittedTicket();
    doc._id = '1234';
    doc.status = 'submitted';
    await doc.save();
    const res = await checkTicket('1234');
    expect(res.status).toEqual(202);
    done();
  });

  it('should handle accepted', async (done) => {
    expect.hasAssertions();
    const doc = new SubmittedTicket();
    doc._id = '1234';
    doc.status = 'accepted';
    await doc.save();
    const res = await checkTicket('1234');
    expect(res.status).toEqual(204);
    done();
  });

  it('should handle declined', async (done) => {
    expect.hasAssertions();
    const doc = new SubmittedTicket();
    doc._id = '1234';
    doc.status = 'declined';
    await doc.save();
    const res = await checkTicket('1234');
    expect(res).toBe(errors.xsgn);
    done();
  });

  it('should handle timeout', async (done) => {
    expect.hasAssertions();
    const doc = new SubmittedTicket();
    doc._id = '1234';
    doc.status = 'timeout';
    await doc.save();
    const res = await checkTicket('1234');
    expect(res).toBe(errors.stna);
    done();
  });
});
