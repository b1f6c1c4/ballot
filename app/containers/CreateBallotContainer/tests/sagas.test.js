import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import { push } from 'react-router-redux';

import * as CREATE_BALLOT_CONTAINER from '../constants';
import * as createBallotContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleCreateBallotRequest,
} from '../sagas';

// Sagas
describe('handleCreateBallotRequest Saga', () => {
  const variables = { name: 'nm' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleCreateBallotRequest(variables);
  const dArgs = [api.mutate, gql.CreateBallot, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen CREATE_BALLOT_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(CREATE_BALLOT_CONTAINER.CREATE_BALLOT_REQUEST)
      .silentRun();
  });

  it('should dispatch createBallotSuccess', () => {
    const createBallot = { bId: 'b' };
    const response = { createBallot };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(createBallotContainerActions.createBallotSuccess(response))
      .put(push('/app/ballots/b'))
      .run();
  });

  it('should dispatch createBallotFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(createBallotContainerActions.createBallotFailure(error))
      .run();
  });
});
