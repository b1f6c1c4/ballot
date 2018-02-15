import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as VIEW_STAT_CONTAINER from '../constants';
import * as viewStatContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleBallotRequest,
  handleStatsRequest,
} from '../sagas';

// Sagas
describe('handleBallotRequest Saga', () => {
  const variables = { bId: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleBallotRequest(variables);
  const dArgs = [api.query, gql.Ballot, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen BALLOT_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_STAT_CONTAINER.BALLOT_REQUEST)
      .silentRun();
  });

  it('should dispatch ballotSuccess', () => {
    const ballot = 'resp';
    const response = { ballot };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(viewStatContainerActions.ballotSuccess(response))
      .run();
  });

  it('should dispatch ballotFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(viewStatContainerActions.ballotFailure(error))
      .run();
  });
});

describe('handleStatsRequest Saga', () => {
  const variables = { bId: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleStatsRequest(variables);
  const dArgs = [api.query, gql.Stats, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen STATS_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_STAT_CONTAINER.STATS_REQUEST)
      .silentRun();
  });

  it('should dispatch statsSuccess', () => {
    const stats = 'resp';
    const response = { stats };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(viewStatContainerActions.statsSuccess(response))
      .run();
  });

  it('should dispatch statsFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(viewStatContainerActions.statsFailure(error))
      .run();
  });
});
