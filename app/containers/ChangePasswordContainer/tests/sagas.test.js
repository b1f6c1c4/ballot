import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import { push } from 'react-router-redux';

import * as CHANGE_PASSWORD_CONTAINER from '../constants';
import * as changePasswordContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handlePasswordRequest,
} from '../sagas';

// Sagas
describe('handlePasswordRequest Saga', () => {
  const variables = { oldPassword: 'val', newPassword: 'val2' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handlePasswordRequest(variables);
  const dArgs = [api.mutate, gql.Password, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen PASSWORD_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(CHANGE_PASSWORD_CONTAINER.PASSWORD_REQUEST)
      .silentRun();
  });

  it('should dispatch passwordSuccess', () => {
    const password = true;
    const response = { password };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(changePasswordContainerActions.passwordSuccess(response))
      .put(push('/app/'))
      .run();
  });

  it('should dispatch passwordFailure when fatal', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(changePasswordContainerActions.passwordFailure(error))
      .run();
  });

  it('should dispatch passwordFailure when wrong', () => {
    const response = { password: false };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put.actionType(CHANGE_PASSWORD_CONTAINER.PASSWORD_FAILURE)
      .run();
  });
});
