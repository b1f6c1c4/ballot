import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import refresh from 'utils/refresh';

import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';
import * as GLOBAL_CONTAINER from '../constants';
import * as globalContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleBallotsRequest,
  handleExtendRequest,
} from '../sagas';

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

describe('handleExtendRequest Saga', () => {
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = handleExtendRequest;
  const dArgs = [api.mutate, gql.Extend, undefined, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen EXTEND_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(GLOBAL_CONTAINER.EXTEND_REQUEST)
      .silentRun();
  });

  it('should dispatch extendSuccess', () => {
    const extend = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM4NjAxNzUsImV4cCI6MTUxMzg2NzM3NSwiYXVkIjoidHJ5LXJlYWN0IiwiaXNzIjoidHJ5LXJlYWN0In0.Y6li_4xDg4dQALJKFqUp0NxXjUH1skPEIg41Z0aN9LE';
    const response = { extend };
    const credential = {
      iat: 1513860175,
      exp: 1513867375,
      aud: 'try-react',
      iss: 'try-react',
      token: extend,
    };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(globalContainerActions.extendSuccess(credential))
      .run();
  });

  it('should dispatch logout', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(globalContainerActions.logout())
      .run();
  });
});

// Watcher
describe('watcher', () => {
  // eslint-disable-next-line arrow-body-style
  it('should forward login to ballotsRequest and statusesRequest', () => {
    return expectSaga(watcher)
      .provide([
        [matchers.put(globalContainerActions.ballotsRequest())],
        [matchers.put(subscriptionContainerActions.statusesRequest())],
      ])
      .put(globalContainerActions.ballotsRequest())
      .put(subscriptionContainerActions.statusesRequest())
      .dispatch(globalContainerActions.login())
      .silentRun();
  });

  // eslint-disable-next-line arrow-body-style
  it('should forward logout to push /app/login', () => {
    return expectSaga(watcher)
      .provide([
        [matchers.call(refresh, '/app/login')],
      ])
      .call(refresh, '/app/login')
      .dispatch(globalContainerActions.logout())
      .silentRun();
  });
});
