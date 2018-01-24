const { models, make, mer, check } = require('../../tests/util');

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

const dSubTicket = {
  _id: '1234',
  status: 'submitted',
  ticket: {
    _id: '12ab',
    payload: {
      bId: '34cd',
      result: ['a', 'e2'],
    },
    s: ['56ef', '78ab'],
    c: ['90cd', '12ef'],
  },
};

describe('submitTicket', () => {
  const dBallot = {
    _id: '34cd',
    status: 'voting',
    fields: [
      { type: 'string' },
      { type: 'enum', data: ['e1', 'e2'] },
    ],
    voters: [{}, {}],
  };
  const dTicket = {
    t: '12ab',
    payload: {
      bId: '34cd',
      result: ['a', 'e2'],
    },
    s: ['56ef', '78ab'],
    c: ['90cd', '12ef'],
  };

  it('should malform extra field', async (done) => {
    const res = await submitTicket(mer(dTicket, 'key', null));
    expect(res).toBe(errors.tkmf);
    done();
  });

  it('should malform extra payload', async (done) => {
    const res = await submitTicket(mer(dTicket, 'payload.key', null));
    expect(res).toBe(errors.tkmf);
    done();
  });

  it('should malform t', async (done) => {
    const res = await submitTicket(mer(dTicket, 't', ''));
    expect(res).toBe(errors.tkmf);
    done();
  });

  it('should malform payload', async (done) => {
    const res = await submitTicket(mer(dTicket, 'payload', 888));
    expect(res).toBe(errors.tkmf);
    done();
  });

  it('should malform payload arr', async (done) => {
    const res = await submitTicket(mer(dTicket, 'payload', []));
    expect(res).toBe(errors.tkmf);
    done();
  });

  it('should malform bId', async (done) => {
    const res = await submitTicket(mer(dTicket, 'payload.bId', '34cD'));
    expect(res).toBe(errors.ntfd);
    done();
  });

  it('should malform result', async (done) => {
    const res = await submitTicket(mer(dTicket, 'payload.result', {}));
    expect(res).toBe(errors.tkmf);
    done();
  });

  it('should malform s', async (done) => {
    const res = await submitTicket(mer(dTicket, 's[1]', '78Ab'));
    expect(res).toBe(errors.tkmf);
    done();
  });

  it('should malform c', async (done) => {
    const res = await submitTicket(mer(dTicket, 'c', [undefined]));
    expect(res).toBe(errors.tkmf);
    done();
  });

  it('should not throw but 500', async (done) => {
    models.Ballot.throwErrOn('findOne');
    const res = await submitTicket(dTicket);
    expect(res.status).toBe(500);
    done();
  });

  it('should not found', async (done) => {
    const res = await submitTicket(dTicket);
    expect(res).toBe(errors.ntfd);
    done();
  });

  it('should malform result length', async (done) => {
    await make.Ballot(dBallot);
    const res = await submitTicket(mer(dTicket, 'payload.result', ['a']));
    expect(res).toBe(errors.rsmf);
    await check.SubmittedTicket();
    done();
  });

  it('should malform s length', async (done) => {
    await make.Ballot(dBallot);
    const res = await submitTicket(mer(dTicket, 's', ['56ef']));
    expect(res).toBe(errors.tkmf);
    await check.SubmittedTicket();
    done();
  });

  it('should malform c length', async (done) => {
    await make.Ballot(dBallot);
    const res = await submitTicket(mer(dTicket, 'c', ['90cd']));
    expect(res).toBe(errors.tkmf);
    await check.SubmittedTicket();
    done();
  });

  it('should malform result type', async (done) => {
    await make.Ballot(dBallot);
    const res = await submitTicket(mer(dTicket, 'payload.result[0]', 1));
    expect(res).toBe(errors.rsmf);
    await check.SubmittedTicket();
    done();
  });

  it('should malform result enum', async (done) => {
    await make.Ballot(dBallot);
    const res = await submitTicket(mer(dTicket, 'payload.result[1]', 'e3'));
    expect(res).toBe(errors.rsmf);
    await check.SubmittedTicket();
    done();
  });

  it('should malform result unknown type', async (done) => {
    await make.Ballot(dBallot, 'fields[0].type', 'unknown');
    const res = await submitTicket(dTicket);
    expect(res).toBe(errors.rsmf);
    await check.SubmittedTicket();
    done();
  });

  it('should not voting', async (done) => {
    await make.Ballot(dBallot, 'status', 'unknown');
    const res = await submitTicket(dTicket);
    expect(res).toBe(errors.stna);
    await check.SubmittedTicket();
    done();
  });

  it('should create if good', async (done) => {
    await make.Ballot(dBallot);
    const res = await submitTicket(dTicket);
    expect(res.status).toEqual(202);
    expect(res.json).toEqual({ tId: 'ttt' });
    await check.SubmittedTicket(dSubTicket, '_id', 'ttt');
    expect(verify.mock.calls.length).toEqual(1);
    expect(verify.mock.calls[0][0]).toBeInstanceOf(models.Ballot);
    expect(verify.mock.calls[0][0]._id).toEqual('34cd');
    expect(verify.mock.calls[0][1]).toBeInstanceOf(models.SubmittedTicket);
    expect(verify.mock.calls[0][1]._id).toEqual('ttt');
    done();
  });
});

describe('checkTicket', () => {
  it('should malform tId', async (done) => {
    const res = await checkTicket('123');
    expect(res).toBe(errors.ntfd);
    done();
  });

  it('should not found', async (done) => {
    const res = await checkTicket('1234');
    expect(res).toBe(errors.ntfd);
    done();
  });

  it('should handle error', async (done) => {
    models.SubmittedTicket.throwErrOn('findOne');
    const res = await checkTicket('1234');
    expect(res.status).toEqual(500);
    done();
  });

  it('should handle unknown', async (done) => {
    await make.SubmittedTicket(dSubTicket, 'status', 'unknown');
    const res = await checkTicket('1234');
    expect(res.status).toEqual(500);
    done();
  });

  it('should handle submitted', async (done) => {
    await make.SubmittedTicket(dSubTicket, 'status', 'submitted');
    const res = await checkTicket('1234');
    expect(res.status).toEqual(202);
    done();
  });

  it('should handle accepted', async (done) => {
    await make.SubmittedTicket(dSubTicket, 'status', 'accepted');
    const res = await checkTicket('1234');
    expect(res.status).toEqual(204);
    done();
  });

  it('should handle declined', async (done) => {
    await make.SubmittedTicket(dSubTicket, 'status', 'declined');
    const res = await checkTicket('1234');
    expect(res).toBe(errors.xsgn);
    done();
  });

  it('should handle timeout', async (done) => {
    await make.SubmittedTicket(dSubTicket, 'status', 'timeout');
    const res = await checkTicket('1234');
    expect(res).toBe(errors.stna);
    done();
  });
});
