import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import { change } from 'redux-form';
import { push } from 'react-router-redux';

import * as globalActions from 'containers/Global/actions';
import * as LOGIN_CONTAINER from '../constants';
import * as loginContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleLoginRequest,
  handleRegisterRequest,
} from '../sagas';

// Sagas
describe('handleLoginRequest Saga', () => {
  const variables = { username: 'un', password: 'pw' };
  const state = fromJS({ form: { loginForm: { values: variables } } });
  const func = handleLoginRequest;
  const dArgs = [api.mutate, gql.Login, variables];

  // eslint-disable-next-line arrow-body-style
  it('should listen LOGIN_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(LOGIN_CONTAINER.LOGIN_REQUEST)
      .silentRun();
  });

  it('should dispatch loginSuccess', () => {
    const login = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM4NjAxNzUsImV4cCI6MTUxMzg2NzM3NSwiYXVkIjoidHJ5LXJlYWN0IiwiaXNzIjoidHJ5LXJlYWN0In0.Y6li_4xDg4dQALJKFqUp0NxXjUH1skPEIg41Z0aN9LE';
    const response = { login };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(globalActions.updateCredential(login))
      .put(loginContainerActions.loginSuccess(response))
      .put(push('/app/'))
      .run();
  });

  it('should dispatch loginFailure when fatal', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(loginContainerActions.loginFailure(error))
      .run();
  });

  it('should dispatch loginFailure when wrong', () => {
    const response = { login: null };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put.actionType(LOGIN_CONTAINER.LOGIN_FAILURE)
      .run();
  });
});

describe('handleRegisterRequest Saga', () => {
  const variables = { username: 'un', password: 'pw' };
  const state = fromJS({ form: { registerForm: { values: variables } } });
  const func = handleRegisterRequest;
  const dArgs = [api.mutate, gql.Register, variables];

  // eslint-disable-next-line arrow-body-style
  it('should listen REGISTER_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(LOGIN_CONTAINER.REGISTER_REQUEST)
      .silentRun();
  });

  it('should dispatch registerSuccess', () => {
    const register = 'resp';
    const response = { register };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(loginContainerActions.registerSuccess(response))
      .put(change('loginForm', 'username', 'un'))
      .run();
  });

  it('should dispatch registerFailure', () => {
    const error = new Error('value');

    return expectSaga(handleRegisterRequest)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(loginContainerActions.registerFailure(error))
      .run();
  });
});

// Watcher
describe('watcher', () => {
  // eslint-disable-next-line arrow-body-style
  it('should forward submitLogin to loginRequest', () => {
    return expectSaga(watcher)
      .provide([
        [matchers.put(loginContainerActions.loginRequest())],
      ])
      .dispatch(loginContainerActions.submitLogin())
      .silentRun();
  });

  // eslint-disable-next-line arrow-body-style
  it('should forward submitRegister to registerRequest', () => {
    return expectSaga(watcher)
      .provide([
        [matchers.put(loginContainerActions.registerRequest())],
      ])
      .dispatch(loginContainerActions.submitRegister())
      .silentRun();
  });
});
