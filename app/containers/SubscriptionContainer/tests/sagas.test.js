import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { dynamic } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as SUBSCRIPTION_CONTAINER from '../constants';
import * as subscriptionContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  makeChan,
  handleStatusRequestAction,
  handleStatusesRequestAction,
  handleVoterRgRequestAction,
  watchStatus,
  watchStatuses,
  watchVoterRg,
  testReset,
} from '../sagas';

describe('makeChan', () => {
  const unsubscribe = jest.fn();
  const obs = {
    subscribe: jest.fn(() => ({ unsubscribe })),
  };
  const func = () => makeChan('itst', obs);

  beforeEach(() => {
    obs.subscribe.mockClear();
    unsubscribe.mockClear();
  });

  it('should subscribe next null', () => {
    func();
    expect(obs.subscribe.mock.calls.length).toEqual(1);
    const obj = obs.subscribe.mock.calls[0][0];
    obj.next();
  });

  it('should subscribe next error', (done) => {
    const res = func();
    expect(obs.subscribe.mock.calls.length).toEqual(1);
    const obj = obs.subscribe.mock.calls[0][0];
    const e = { key: 'val' };
    res.take((action) => {
      expect(action).toEqual({ error: e });
      done();
    });
    obj.next({ errors: e });
  });

  it('should subscribe next not null', (done) => {
    const res = func();
    expect(obs.subscribe.mock.calls.length).toEqual(1);
    const obj = obs.subscribe.mock.calls[0][0];
    const st = { bId: 'b', status: 's' };
    res.take((action) => {
      expect(action).toEqual({ result: st });
      done();
    });
    obj.next({ data: { itst: st } });
  });

  it('should return unsubscribe', () => {
    const res = func();
    res.close();
    expect(unsubscribe.mock.calls.length).toEqual(1);
  });
});

describe('handleStatusRequestAction', () => {
  const state = fromJS({});
  const variables = { bId: 'b' };
  const func = () => handleStatusRequestAction(variables);
  const dArgs0 = [api.subscribe, gql.BallotStatus, variables];
  const dArgs1 = [makeChan, 'ballotStatus', 123];

  it('should quit if error', () => {
    const chan = 'chan';
    const e = { key: 'val' };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .call(...dArgs1)
      .take(chan)
      .provide([
        [matchers.call(...dArgs0), 123],
        [matchers.call(...dArgs1), chan],
        [matchers.take(chan), { error: e }],
      ])
      .run();
  });

  it('should dispatch statusChange', () => {
    const chan = 'chan';
    const res = { bId: '1', status: '2' };
    let id = 0;
    const fn = (par, next) => {
      id += 1;
      if (id > 2) return next();
      return { result: res };
    };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .call(...dArgs1)
      .take(chan)
      .take(chan)
      .provide([
        [matchers.call(...dArgs0), 123],
        [matchers.call(...dArgs1), chan],
        [matchers.take(chan), dynamic(fn)],
      ])
      .put(subscriptionContainerActions.statusChange(res))
      .put(subscriptionContainerActions.statusChange(res))
      .silentRun();
  });
});

describe('handleStatusesRequestAction', () => {
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = handleStatusesRequestAction;
  const dArgs0 = [api.subscribe, gql.BallotsStatus, undefined, 'cre'];
  const dArgs1 = [makeChan, 'ballotsStatus', 123];

  // eslint-disable-next-line arrow-body-style
  it('should return if no cred', () => {
    return expectSaga(func)
      .withState(state.setIn(['globalContainer', 'credential'], undefined))
      .run();
  });

  it('should quit if error', () => {
    const chan = 'chan';
    const e = { key: 'val' };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .call(...dArgs1)
      .take(chan)
      .provide([
        [matchers.call(...dArgs0), 123],
        [matchers.call(...dArgs1), chan],
        [matchers.take(chan), { error: e }],
      ])
      .run();
  });

  it('should dispatch statusChange', () => {
    const chan = 'chan';
    const res = { bId: '1', status: '2' };
    let id = 0;
    const fn = (par, next) => {
      id += 1;
      if (id > 2) return next();
      return { result: res };
    };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .call(...dArgs1)
      .take(chan)
      .take(chan)
      .provide([
        [matchers.call(...dArgs0), 123],
        [matchers.call(...dArgs1), chan],
        [matchers.take(chan), dynamic(fn)],
      ])
      .put(subscriptionContainerActions.statusChange(res))
      .put(subscriptionContainerActions.statusChange(res))
      .silentRun();
  });
});

describe('handleVoterRgRequestAction', () => {
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleVoterRgRequestAction({ bId: '66' });
  const dArgs0 = [api.subscribe, gql.VoterRegistered, { bId: '66' }, 'cre'];
  const dArgs1 = [makeChan, 'voterRegistered', 123];

  // eslint-disable-next-line arrow-body-style
  it('should return if no cred', () => {
    return expectSaga(func)
      .withState(state.setIn(['globalContainer', 'credential'], undefined))
      .run();
  });

  it('should quit if error', () => {
    const chan = 'chan';
    const e = { key: 'val' };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .call(...dArgs1)
      .take(chan)
      .provide([
        [matchers.call(...dArgs0), 123],
        [matchers.call(...dArgs1), chan],
        [matchers.take(chan), { error: e }],
      ])
      .run();
  });

  it('should dispatch voterRegistered', () => {
    const chan = 'chan';
    const res = ['66', { iCode: '2' }];
    let id = 0;
    const fn = (par, next) => {
      id += 1;
      if (id > 2) return next();
      return { result: { iCode: '2' } };
    };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .call(...dArgs1)
      .take(chan)
      .take(chan)
      .provide([
        [matchers.call(...dArgs0), 123],
        [matchers.call(...dArgs1), chan],
        [matchers.take(chan), dynamic(fn)],
      ])
      .put(subscriptionContainerActions.voterRegistered(...res))
      .put(subscriptionContainerActions.voterRegistered(...res))
      .silentRun();
  });
});

// Sagas

// Watcher
const mockOb = () => ({
  isRunning: () => true,
});

describe('watchStatus', () => {
  beforeEach(() => testReset());

  const state = fromJS({
    globalContainer: { credential: { username: 'un' } },
  });

  it('should take request dedup', async (done) => {
    const req = (bId) => subscriptionContainerActions.statusRequest({
      bId,
      owner: 'x',
    });
    const ob = mockOb();
    let id = 0;
    const fn = () => {
      id += 1;
      expect(id).toBeLessThanOrEqual(1);
      return ob;
    };

    await expectSaga(watchStatus)
      .withState(state)
      .fork(handleStatusRequestAction, req('1'))
      .provide([
        [matchers.fork(handleStatusRequestAction, req('1')), dynamic(fn)],
      ])
      .dispatch(req('1'))
      .dispatch(req('1'))
      .dispatch(subscriptionContainerActions.statusStop())
      .silentRun();

    expect(ob.isRunning()).toEqual(false);
    done();
  });

  it('should take if no statuses', async (done) => {
    const req = (bId) => subscriptionContainerActions.statusRequest({
      bId,
      owner: 'un',
    });
    const ob = mockOb();

    await expectSaga(watchStatus)
      .withState(state)
      .fork(handleStatusRequestAction, req('1'))
      .provide([
        [matchers.fork(handleStatusRequestAction, req('1')), ob],
      ])
      .dispatch(req('1'))
      .silentRun();

    expect(ob.isRunning()).toEqual(true);
    done();
  });

  it('should not take if statuses', async (done) => {
    testReset({ Statuses: mockOb() });

    const req = (bId) => subscriptionContainerActions.statusRequest({
      bId,
      owner: 'un',
    });
    const ob = mockOb();

    await expectSaga(watchStatus)
      .withState(state)
      .provide([
        [matchers.fork(handleStatusRequestAction, req('1')), ob],
      ])
      .dispatch(req('1'))
      .silentRun();

    done();
  });

  // eslint-disable-next-line arrow-body-style
  it('should listen in the watcher', () => {
    return expectSaga(watcher)
      .take(SUBSCRIPTION_CONTAINER.STATUS_REQUEST_ACTION)
      .silentRun();
  });
});

describe('watchStatuses', () => {
  beforeEach(() => testReset());

  it('should take request dedup', async (done) => {
    const req = subscriptionContainerActions.statusesRequest();
    const ob = mockOb();
    let id = 0;
    const fn = () => {
      id += 1;
      expect(id).toBeLessThanOrEqual(1);
      return ob;
    };

    await expectSaga(watchStatuses)
      .fork(handleStatusesRequestAction, req)
      .provide([
        [matchers.fork(handleStatusesRequestAction, req), dynamic(fn)],
      ])
      .dispatch(req)
      .dispatch(req)
      .dispatch(subscriptionContainerActions.statusesStop())
      .silentRun();

    expect(ob.isRunning()).toEqual(false);
    done();
  });

  // eslint-disable-next-line arrow-body-style
  it('should listen in the watcher', () => {
    return expectSaga(watcher)
      .take(SUBSCRIPTION_CONTAINER.STATUSES_REQUEST_ACTION)
      .silentRun();
  });
});

describe('watchVoterRg', () => {
  beforeEach(() => testReset());

  it('should take request dedup', async (done) => {
    const req = (bId) => subscriptionContainerActions.voterRgRequest({ bId });
    const ob = mockOb();
    let id = 0;
    const fn = () => {
      id += 1;
      expect(id).toBeLessThanOrEqual(1);
      return ob;
    };

    await expectSaga(watchVoterRg)
      .fork(handleVoterRgRequestAction, req('1'))
      .provide([
        [matchers.fork(handleVoterRgRequestAction, req('1')), dynamic(fn)],
      ])
      .dispatch(req('1'))
      .dispatch(req('1'))
      .dispatch(subscriptionContainerActions.voterRgStop())
      .silentRun();

    expect(ob.isRunning()).toEqual(false);
    done();
  });

  it('should take request single', async (done) => {
    const req = (bId) => subscriptionContainerActions.voterRgRequest({ bId });
    const ob1 = mockOb();
    const ob2 = mockOb();

    await expectSaga(watchVoterRg)
      .fork(handleVoterRgRequestAction, req('1'))
      .provide([
        [matchers.fork(handleVoterRgRequestAction, req('1')), ob1],
        [matchers.fork(handleVoterRgRequestAction, req('2')), ob2],
      ])
      .dispatch(req('1'))
      .dispatch(req('2'))
      .silentRun();

    expect(ob1.isRunning()).toEqual(false);
    expect(ob2.isRunning()).toEqual(true);
    done();
  });

  // eslint-disable-next-line arrow-body-style
  it('should listen in the watcher', () => {
    return expectSaga(watcher)
      .take(SUBSCRIPTION_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .silentRun();
  });
});
