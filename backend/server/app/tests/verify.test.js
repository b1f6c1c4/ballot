const { models, make, check } = require('../../tests/bundle');
const finalizeVerify = require('../verify');

describe('verify', () => {
  const func = finalizeVerify;
  const dCon = { method: 'verify', _id: 'ttt', bId: '123' };
  const dBallot = { _id: '123', status: 'voting' };
  const dSignedTicket = {
    _id: 't',
    payload: { bId: '123', result: ['a', 'b'] },
    s: ['s'],
    c: ['c'],
  };
  const dSubTicket = {
    _id: 'ttt',
    status: 'submitted',
    ticket: dSignedTicket,
  };

  it('should not throw if errored', async () => {
    models.Ballot.throwErrOn('findOne');
    await func({ valid: 0 }, dCon);
  });

  it('should not throw if ballot not found', async () => {
    models.Ballot.checkOn('findOne');
    await func({ valid: 0 }, dCon);
  });

  it('should not throw if submitted ticket not found', async () => {
    await make.Ballot(dBallot);
    await func({ valid: 0 }, dCon);
    await check.SignedTicket();
  });

  it('should handle declined', async () => {
    await make.Ballot(dBallot);
    await make.SubmittedTicket(dSubTicket);
    await func({ valid: 0 }, dCon);
    await check.SubmittedTicket(dSubTicket, 'status', 'declined');
    await check.SignedTicket();
  });

  it('should handle timeout', async () => {
    await make.Ballot(dBallot, 'status', 'unknown');
    await make.SubmittedTicket(dSubTicket);
    await func({ valid: 0 }, dCon);
    await check.SubmittedTicket(dSubTicket, 'status', 'timeout');
    await check.SignedTicket();
  });

  it('should not change unknown ticket status', async () => {
    await make.Ballot(dBallot);
    await make.SubmittedTicket(dSubTicket, 'status', 'unknown');
    await func({ valid: 0 }, dCon);
    await check.SubmittedTicket(dSubTicket, 'status', 'unknown');
    await check.SignedTicket();
  });

  it('should handle accept', async () => {
    await make.Ballot(dBallot);
    await make.SubmittedTicket(dSubTicket);
    await func({ valid: 1 }, dCon);
    await check.SubmittedTicket(dSubTicket, 'status', 'accepted');
    await check.SignedTicket(dSignedTicket);
  });
});
