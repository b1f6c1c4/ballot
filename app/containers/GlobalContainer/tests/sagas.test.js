import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError, dynamic } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import { push } from 'react-router-redux';

import * as GLOBAL_CONTAINER from '../constants';
import * as globalContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  ballotsStatusChan,
  handleStatusRequestAction,
  handleBallotsRequest,
  watchStatus,
} from '../sagas';

describe('ballotsStatusChan', () => {
  const unsubscribe = jest.fn();
  const obs = {
    subscribe: jest.fn(() => ({ unsubscribe })),
  };
  const func = () => ballotsStatusChan(obs);

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

  it('should subscribe next not null', (done) => {
    const res = func();
    expect(obs.subscribe.mock.calls.length).toEqual(1);
    const obj = obs.subscribe.mock.calls[0][0];
    const st = { bId: 'b', status: 's' };
    res.take((action) => {
      expect(action).toEqual(st);
      done();
    });
    obj.next({ data: { ballotsStatus: st } });
  });

  it('should return unsubscribe', () => {
    const res = func();
    res.close();
    expect(unsubscribe.mock.calls.length).toEqual(1);
  });
});

describe('handleStatusRequestAction', () => {
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = handleStatusRequestAction;
  const dArgs0 = [api.subscribe, gql.BallotsStatus, undefined, 'cre'];
  const dArgs1 = [ballotsStatusChan, 123];

  it('should dispatch statusChange', () => {
    const chan = 'chan';
    const res = { bId: '1', status: '2' };
    let id = 0;
    const fn = (par, next) => {
      id += 1;
      if (id > 2) return next();
      return res;
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
      .put(globalContainerActions.statusChange(res))
      .put(globalContainerActions.statusChange(res))
      .silentRun();
  });
});

// Sagas
describe('handleBallotsRequest Saga', () => {
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = handleBallotsRequest;
  const dArgs = [api.query, gql.Ballots, undefined, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen BALLOTS_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(GLOBAL_CONTAINER.BALLOTS_REQUEST)
      .silentRun();
  });

  it('should dispatch ballotsSuccess', () => {
    const ballots = 'resp';
    const response = { ballots };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(globalContainerActions.ballotsSuccess(response))
      .run();
  });

  it('should dispatch ballotsFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(globalContainerActions.ballotsFailure(error))
      .run();
  });
});

// Watcher
describe('watchStatus', () => {
  it('should take request dedup', () => {
    const req = globalContainerActions.statusRequest();
    let id = 0;
    const fn = () => {
      id += 1;
      expect(id).toBeLessThanOrEqual(1);
      return {};
    };

    return expectSaga(watchStatus)
      .fork(handleStatusRequestAction, req)
      .provide([
        [matchers.fork(handleStatusRequestAction, req), dynamic(fn)],
      ])
      .dispatch(req)
      .dispatch(req)
      .silentRun();
  });
});

describe('watcher', () => {
  // eslint-disable-next-line arrow-body-style
  it('should forward login to ballotsRequest and statusRequest', () => {
    return expectSaga(watcher)
      .provide([
        [matchers.put(globalContainerActions.ballotsRequest())],
        [matchers.put(globalContainerActions.statusRequest())],
      ])
      .put(globalContainerActions.ballotsRequest())
      .put(globalContainerActions.statusRequest())
      .dispatch(globalContainerActions.login())
      .silentRun();
  });

  // eslint-disable-next-line arrow-body-style
  it('should forward logout to push /app/login', () => {
    return expectSaga(watcher)
      .provide([
        [matchers.put(push('/app/login'))],
        [matchers.put(globalContainerActions.statusStop())],
      ])
      .put(push('/app/login'))
      .put(globalContainerActions.statusStop())
      .dispatch(globalContainerActions.logout())
      .silentRun();
  });
});
