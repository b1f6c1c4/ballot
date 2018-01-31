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
  const variables = { bId: 'value' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleBallotRequest(variables);
  const dArgs = [api.query, gql.Ballot, variables, 'cre'];

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

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(viewBallotContainerActions.ballotFailure(error))
      .run();
  });
});
