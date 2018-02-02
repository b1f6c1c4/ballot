import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as PRE_VOTING_CONTAINER from '../constants';
import * as preVotingContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleRefreshRequest,
  handleSignRequest,
} from '../sagas';

// Sagas
describe('handleRefreshRequest Saga', () => {
  const variables = { bId: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleRefreshRequest(variables);
  const dArgs = [api.query, gql.Refresh, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen REFRESH_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(PRE_VOTING_CONTAINER.REFRESH_REQUEST)
      .silentRun();
  });

  it('should dispatch refreshSuccess', () => {
    const refresh = 'resp';
    const response = { refresh };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(preVotingContainerActions.refreshSuccess(response))
      .run();
  });

  it('should dispatch refreshFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(preVotingContainerActions.refreshFailure(error))
      .run();
  });
});

describe('handleSignRequest Saga', () => {
  const variables = { payload: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleSignRequest(variables);
  const dArgs = [api.query, gql.Sign, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen SIGN_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(PRE_VOTING_CONTAINER.SIGN_REQUEST)
      .silentRun();
  });

  it('should dispatch signSuccess', () => {
    const sign = 'resp';
    const response = { sign };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(preVotingContainerActions.signSuccess(response))
      .run();
  });

  it('should dispatch signFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(preVotingContainerActions.signFailure(error))
      .run();
  });
});
