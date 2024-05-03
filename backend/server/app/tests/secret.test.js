const { models, make, mer, check } = require('../../tests/bundle');

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
  const func = submitTicket;
  const dBallot = {
    _id: '34cd',
    status: 'voting',
    fields: [
      { type: 'string' },
      { type: 'enum', data: ['e1', 'e2'] },
    ],
    voters: [{}, {}],
  };
  const dArg = {
    t: '12ab',
    payload: {
      bId: '34cd',
      result: ['a', 'e2'],
    },
    s: ['56ef', '78ab'],
    c: ['90cd', '12ef'],
  };

  it('should malform extra field', async () => {
    const res = await func(mer(dArg, 'key', null));
    expect(res).toBe(errors.tkmf);
  });

  it('should malform extra payload', async () => {
    const res = await func(mer(dArg, 'payload.key', null));
    expect(res).toBe(errors.tkmf);
  });

  it('should malform t', async () => {
    const res = await func(mer(dArg, 't', ''));
    expect(res).toBe(errors.tkmf);
  });

  it('should malform payload', async () => {
    const res = await func(mer(dArg, 'payload', 888));
    expect(res).toBe(errors.tkmf);
  });

  it('should malform payload arr', async () => {
    const res = await func(mer(dArg, 'payload', []));
    expect(res).toBe(errors.tkmf);
  });

  it('should malform bId', async () => {
    const res = await func(mer(dArg, 'payload.bId', '34cD'));
    expect(res).toBe(errors.ntfd);
  });

  it('should malform result', async () => {
    const res = await func(mer(dArg, 'payload.result', {}));
    expect(res).toBe(errors.tkmf);
  });

  it('should malform s', async () => {
    const res = await func(mer(dArg, 's[1]', '78Ab'));
    expect(res).toBe(errors.tkmf);
  });

  it('should malform c', async () => {
    const res = await func(mer(dArg, 'c', [undefined]));
    expect(res).toBe(errors.tkmf);
  });

  it('should not throw but 500', async () => {
    models.Ballot.throwErrOn('findOne');
    const res = await func(dArg);
    expect(res.status).toBe(500);
  });

  it('should not found', async () => {
    const res = await func(dArg);
    expect(res).toBe(errors.ntfd);
  });

  it('should malform result length', async () => {
    await make.Ballot(dBallot);
    const res = await func(mer(dArg, 'payload.result', ['a']));
    expect(res).toBe(errors.rsmf);
    await check.SubmittedTicket();
  });

  it('should malform s length', async () => {
    await make.Ballot(dBallot);
    const res = await func(mer(dArg, 's', ['56ef']));
    expect(res).toBe(errors.tkmf);
    await check.SubmittedTicket();
  });

  it('should malform c length', async () => {
    await make.Ballot(dBallot);
    const res = await func(mer(dArg, 'c', ['90cd']));
    expect(res).toBe(errors.tkmf);
    await check.SubmittedTicket();
  });

  it('should malform result type', async () => {
    await make.Ballot(dBallot);
    const res = await func(mer(dArg, 'payload.result[0]', 1));
    expect(res).toBe(errors.rsmf);
    await check.SubmittedTicket();
  });

  it('should malform result enum', async () => {
    await make.Ballot(dBallot);
    const res = await func(mer(dArg, 'payload.result[1]', 'e3'));
    expect(res).toBe(errors.rsmf);
    await check.SubmittedTicket();
  });

  it('should malform result unknown type', async () => {
    await make.Ballot(dBallot, 'fields[0].type', 'unknown');
    const res = await func(dArg);
    expect(res).toBe(errors.rsmf);
    await check.SubmittedTicket();
  });

  it('should not voting', async () => {
    await make.Ballot(dBallot, 'status', 'unknown');
    const res = await func(dArg);
    expect(res).toBe(errors.stna);
    await check.SubmittedTicket();
  });

  it('should create if good', async () => {
    verify.mockImplementationOnce(async () => undefined);
    await make.Ballot(dBallot);
    const res = await func(dArg);
    expect(res.status).toEqual(202);
    expect(res.json).toEqual({ tId: 'ttt' });
    await check.SubmittedTicket(dSubTicket, '_id', 'ttt');
    expect(verify.mock.calls.length).toEqual(1);
    expect(verify.mock.calls[0][0]).toBeInstanceOf(models.Ballot);
    expect(verify.mock.calls[0][0]._id).toEqual('34cd');
    expect(verify.mock.calls[0][1]).toBeInstanceOf(models.SubmittedTicket);
    expect(verify.mock.calls[0][1]._id).toEqual('ttt');
  });
});

describe('checkTicket', () => {
  const func = checkTicket;
  it('should malform tId', async () => {
    const res = await func('123');
    expect(res).toBe(errors.ntfd);
  });

  it('should not found', async () => {
    const res = await func('1234');
    expect(res).toBe(errors.ntfd);
  });

  it('should handle error', async () => {
    models.SubmittedTicket.throwErrOn('findOne');
    const res = await func('1234');
    expect(res.status).toEqual(500);
  });

  it('should handle unknown', async () => {
    await make.SubmittedTicket(dSubTicket, 'status', 'unknown');
    const res = await func('1234');
    expect(res.status).toEqual(500);
  });

  it('should handle submitted', async () => {
    await make.SubmittedTicket(dSubTicket, 'status', 'submitted');
    const res = await func('1234');
    expect(res.status).toEqual(202);
  });

  it('should handle accepted', async () => {
    await make.SubmittedTicket(dSubTicket, 'status', 'accepted');
    const res = await func('1234');
    expect(res.status).toEqual(204);
  });

  it('should handle declined', async () => {
    await make.SubmittedTicket(dSubTicket, 'status', 'declined');
    const res = await func('1234');
    expect(res).toBe(errors.xsgn);
  });

  it('should handle timeout', async () => {
    await make.SubmittedTicket(dSubTicket, 'status', 'timeout');
    const res = await func('1234');
    expect(res).toBe(errors.stna);
  });
});
