const { models, make, mer } = require('../../../tests/util');
const errors = require('../error');

jest.mock('../projection', () => ({
  project(info) {
    expect(info.key).toEqual('info');
    const obj = { _id: 0 };
    info.projs.forEach((k) => { obj[k] = 1; });
    return obj;
  },
}));

let throttleThrow = false;
jest.doMock('../throttle', () => () => async () => {
  if (throttleThrow) {
    throw new errors.TooManyRequestsError(666);
  }
});

beforeEach(() => {
  throttleThrow = false;
});

// eslint-disable-next-line global-require
const { resolvers } = require('../stat');

const dTickets = [
  {
    _id: 'aaa',
    s: ['s1', 's2'],
    c: ['c1', 'c2'],
    payload: {
      bId: '457',
      result: ['r1', 'r2', 'r3'],
    },
  },
  {
    _id: 'bbb',
    s: ['s1', 's2'],
    c: ['c1', 'c2'],
    payload: {
      bId: '456',
      result: ['r1', 'r2', ''],
    },
  },
  {
    _id: 'ccc',
    s: ['s1', 's2'],
    c: ['c1', 'c2'],
    payload: {
      bId: '456',
      result: ['r1', 'R2', 'r3'],
    },
  },
  {
    _id: 'ddd',
    s: ['s1', 's2'],
    c: ['c1', 'c2'],
    payload: {
      bId: '456',
      result: ['r1', 'R2', ''],
    },
  },
];

describe('Query', () => {
  describe('countTickets', () => {
    const func = resolvers.Query.countTickets;
    const dArgs = [
      undefined,
      { input: { bId: '456' } },
      undefined,
    ];
    const targ = 3;

    it('should not throw if error', async (done) => {
      models.SignedTicket.throwErrOn('count');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should throttle', async (done) => {
      throttleThrow = true;
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.TooManyRequestsError);
      done();
    });

    it('should count if good', async (done) => {
      await Promise.all(dTickets.map((t) => make.SignedTicket(t)));
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      done();
    });
  });

  describe('tickets', () => {
    const func = resolvers.Query.tickets;
    const dArgs = [
      undefined,
      { input: { bId: '457' } },
      undefined,
      { key: 'info', projs: ['s', 'payload.bId'] },
    ];
    const targ = [
      {
        s: ['s1', 's2'],
        payload: { bId: '457' },
      },
    ];

    it('should not throw if error', async (done) => {
      models.SignedTicket.throwErrOn('find');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should throttle', async (done) => {
      throttleThrow = true;
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.TooManyRequestsError);
      done();
    });

    it('should query if good', async (done) => {
      await Promise.all(dTickets.map((t) => make.SignedTicket(t)));
      const res = await func(...dArgs);
      expect(res).toEqual(targ);
      done();
    });
  });

  describe('fieldStat', () => {
    const func = resolvers.Query.fieldStat;
    const dArgs = [
      undefined,
      { input: { bId: '456' } },
      undefined,
    ];

    it('should not throw if error', async (done) => {
      models.SignedTicket.throwErrOn('aggregate');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should throttle', async (done) => {
      throttleThrow = true;
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.TooManyRequestsError);
      done();
    });

    it('should query if good 0', async (done) => {
      await Promise.all(dTickets.map((t) => make.SignedTicket(t)));
      const res = await func(...mer(dArgs, '[1].input.index', 0));
      expect(res).toEqual([
        { _id: 'r1', count: 3 },
      ]);
      done();
    });

    it('should query if good 1', async (done) => {
      await Promise.all(dTickets.map((t) => make.SignedTicket(t)));
      const res = await func(...mer(dArgs, '[1].input.index', 1));
      expect(res).toEqual([
        { _id: 'R2', count: 2 },
        { _id: 'r2', count: 1 },
      ]);
      done();
    });

    it('should query if good 2', async (done) => {
      await Promise.all(dTickets.map((t) => make.SignedTicket(t)));
      const res = await func(...mer(dArgs, '[1].input.index', 2));
      expect(res).toEqual([
        { _id: '', count: 2 },
        { _id: 'r3', count: 1 },
      ]);
      done();
    });
  });
});

describe('FieldStat', () => {
  describe('answer', () => {
    const func = resolvers.FieldStat.answer;

    it('should pluck _id', () => {
      expect(func({ _id: 'a' })).toEqual('a');
    });
  });
});
