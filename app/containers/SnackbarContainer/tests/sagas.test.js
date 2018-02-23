import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as SNACKBAR_CONTAINER from '../constants';
import * as snackbarContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleExternalRequest,
} from '../sagas';

// Sagas
describe('handleExternalRequest Saga', () => {
  const variables = { id: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleExternalRequest(variables);
  const dArgs = [api.query, gql.External, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen EXTERNAL_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(SNACKBAR_CONTAINER.EXTERNAL_REQUEST)
      .silentRun();
  });

  it('should dispatch externalSuccess', () => {
    const external = 'resp';
    const response = { external };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(snackbarContainerActions.externalSuccess(response))
      .run();
  });

  it('should dispatch externalFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(snackbarContainerActions.externalFailure(error))
      .run();
  });
});
