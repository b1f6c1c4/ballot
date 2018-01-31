import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as VIEW_BALLOT_CONTAINER from '../constants';
import * as viewBallotContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleBallotRequest,
} from '../sagas';

// Sagas
describe('handleBallotRequest Saga', () => {
  const variables = { key: 'value' };
  const state = fromJS({ viewBallotContainer: { name: variables } });
  const func = handleBallotRequest;
  const dArgs = [api.query, gql.FetchData, variables];

  // eslint-disable-next-line arrow-body-style
  it('should listen BALLOT_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_BALLOT_CONTAINER.BALLOT_REQUEST)
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
      .put(viewBallotContainerActions.ballotSuccess(response))
      .run();
  });

  it('should dispatch ballotFailure', () => {
    const error = new Error('value');

    return expectSaga(handleBallotRequest)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(viewBallotContainerActions.ballotFailure(error))
      .run();
  });
});

// Watcher
describe('watcher', () => {
  // eslint-disable-next-line arrow-body-style
  it('should forward refresh to ballotRequest', () => {
    return expectSaga(watcher)
      .provide([
        [matchers.put(viewBallotContainerActions.ballotRequest())],
      ])
      .dispatch(viewBallotContainerActions.refresh())
      .silentRun();
  });
});
