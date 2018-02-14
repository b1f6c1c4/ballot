const { models, make, mer } = require('../../../tests/util');
const errors = require('../error');

const rpcMock = {
  rawPublish: jest.fn(),
  subscribe: jest.fn(),
};
jest.doMock('../../../rpc', () => rpcMock);

// eslint-disable-next-line global-require
const {
  subsLib,
  pubsub,
  lock,
  unlock,
  makeBallotSt,
  subscribeBallotStatus,
  subscribeBallotsStatus,
  onOperation,
  onOperationComplete,
  resolvers,
} = require('../subscription');

describe('lock', () => {
  beforeEach(() => {
    subsLib.clear();
  });

  it('should handle hit', async (done) => {
    subsLib.set('k', { num: 123 });
    await lock('k', () => {
      expect(undefined).toBeDefined();
    });
    expect(subsLib.get('k')).toEqual({ num: 124 });
    done();
  });

  it('should handle miss', async (done) => {
    rpcMock.subscribe.mockImplementationOnce(async (k, cb) => {
      expect(k).toEqual('k');
      expect(cb()).toEqual(666);
      return 233;
    });
    await lock('k', () => 666);
    expect(subsLib.get('k')).toEqual({ num: 1, diss: 233 });
    done();
  });
});

describe('unlock', () => {
  beforeEach(() => {
    subsLib.clear();
  });

  it('should handle not found', () => {
    expect(() => unlock('sth')).not.toThrow();
  });

  it('should handle diss', () => {
    subsLib.set('k', { num: 123 });
    unlock('k');
    expect(subsLib.get('k')).toEqual({ num: 122 });
  });

  it('should handle dismiss', (done) => {
    subsLib.set('k', { num: 1, diss: () => done() });
    unlock('k');
    expect(subsLib.get('k')).toBeUndefined();
  });
});

describe('makeBallotSt', () => {
  it('should make', () => {
    expect(makeBallotSt('status.ow.id', 'st')).toEqual({
      bId: 'id',
      owner: 'ow',
      status: 'st',
    });
  });
});

describe('subscribeBallotStatus', () => {
  beforeEach(() => {
    subsLib.clear();
  });

  it('should publish', (done) => {
    expect.hasAssertions();
    rpcMock.subscribe.mockImplementationOnce(async (k, cb) => {
      expect(k).toEqual('status.*.234');
      const it = pubsub.asyncIterator('ballotStatus.234');
      cb('status.ow.id', 'st');
      const rx = await it.next();
      expect(rx.value).toEqual({
        ballotStatus: {
          bId: 'id',
          owner: 'ow',
          status: 'st',
        },
      });
      done();
    });
    subscribeBallotStatus('234');
  });

  it('should return unlock', async (done) => {
    expect.assertions(2);
    rpcMock.subscribe.mockImplementationOnce(async () => () => {
      expect(undefined).toBeUndefined();
    });
    const res = await subscribeBallotStatus('234');
    res();
    expect(subsLib.size).toEqual(0);
    done();
  });
});

describe('subscribeBallotsStatus', () => {
  beforeEach(() => {
    subsLib.clear();
  });

  it('should publish', (done) => {
    expect.hasAssertions();
    rpcMock.subscribe.mockImplementationOnce(async (k, cb) => {
      expect(k).toEqual('status.ow.*');
      const it = pubsub.asyncIterator('ballotsStatus.ow');
      cb('status.ow.id', 'st');
      const rx = await it.next();
      expect(rx.value).toEqual({
        ballotsStatus: {
          bId: 'id',
          owner: 'ow',
          status: 'st',
        },
      });
      done();
    });
    subscribeBallotsStatus('ow');
  });

  it('should return unlock', async (done) => {
    expect.assertions(2);
    rpcMock.subscribe.mockImplementationOnce(async () => () => {
      expect(undefined).toBeUndefined();
    });
    const res = await subscribeBallotsStatus('ow');
    res();
    expect(subsLib.size).toEqual(0);
    done();
  });
});

describe('onOperation', () => {
  it('should add registry if none', () => {
    const ws = {};
    const params = {};
    const res = onOperation({ id: '233' }, params, ws);
    expect(ws.registry).toBeInstanceOf(Map);
    expect(res.context.registry).toBe(ws.registry);
    expect(res.context.opId).toEqual('233');
  });

  it('should not add registry if exist', () => {
    const reg = new Map();
    const ws = { registry: reg };
    const params = {};
    const res = onOperation({ id: '233' }, params, ws);
    expect(ws.registry).toBe(reg);
    expect(res.context.registry).toBe(ws.registry);
    expect(res.context.opId).toEqual('233');
  });
});

describe('onOperationComplete', () => {
  it('should handle missing registry', () => {
    expect(() => onOperationComplete({}, '233')).not.toThrow();
  });

  it('should handle missing callback', () => {
    const reg = new Map();
    expect(() => onOperationComplete({ registry: reg }, '233')).not.toThrow();
  });

  it('should handle evil callback', () => {
    const reg = new Map();
    reg.set('233', {});
    expect(() => onOperationComplete({ registry: reg }, '233')).not.toThrow();
  });

  it('should call callback', (done) => {
    const reg = new Map();
    reg.set('233', done);
    expect(() => onOperationComplete({ registry: reg }, '233')).not.toThrow();
  });
});

describe('Subscription', () => {
  const dBallot = {
    _id: '123',
  };

  describe('ballotStatus', () => {
    const func = resolvers.Subscription.ballotStatus.subscribe;
    const dArgs = [
      undefined,
      { input: { bId: '123' } },
      { registry: new Map(), opId: 'a' },
    ];

    it('should not throw if error', async (done) => {
      models.Ballot.throwErrOn('findOne');
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should handle not found', async (done) => {
      const res = await func(...dArgs);
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should return async iterator', async (done) => {
      await make.Ballot(dBallot);
      const res = await func(...dArgs);
      expect(res.next).toBeDefined();
      done();
    });

    it('should use pubsub', async (done) => {
      await make.Ballot(dBallot);
      const res = await func(...dArgs);
      pubsub.publish('ballotStatus.1234', { evil: true });
      pubsub.publish('ballotStatus.123', { evil: false });
      const rx = await res.next();
      expect(rx.value).toEqual({ evil: false });
      done();
    });
  });

  describe('ballotsStatus', () => {
    const func = resolvers.Subscription.ballotsStatus.subscribe;
    const dArgs = [
      undefined,
      undefined,
      {
        auth: { username: 'un' },
        registry: new Map(),
        opId: 'a',
      },
    ];

    it('should throw unauthorized', async (done) => {
      const res = await func(...mer(dArgs, '[2]', {}));
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should return async iterator', async (done) => {
      const res = await func(...dArgs);
      expect(res.next).toBeDefined();
      done();
    });

    it('should use pubsub', async (done) => {
      const res = await func(...dArgs);
      pubsub.publish('ballotsStatus.uw', { evil: true });
      pubsub.publish('ballotsStatus.un', { evil: false });
      const rx = await res.next();
      expect(rx.value).toEqual({ evil: false });
      done();
    });
  });
});
