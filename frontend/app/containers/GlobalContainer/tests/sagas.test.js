import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import { push } from 'react-router-redux';

import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';
import * as GLOBAL_CONTAINER from '../constants';
import * as globalContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleBallotsRequest,
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
        [matchers.put(push('/app/login'))],
        [matchers.put(subscriptionContainerActions.statusesStop())],
      ])
      .put(push('/app/login'))
      .put(subscriptionContainerActions.statusesStop())
      .dispatch(globalContainerActions.logout())
      .silentRun();
  });
});
