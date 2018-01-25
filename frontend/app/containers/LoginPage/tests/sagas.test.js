import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import { change } from 'redux-form';
import { push } from 'react-router-redux';

import * as globalActions from 'containers/Global/actions';
import * as LOGIN_PAGE from '../constants';
import * as loginPageActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleLoginRequest,
} from '../sagas';

// Sagas
describe('handleLoginRequest Saga', () => {
  const variables = { username: 'un', password: 'pw' };
  const state = fromJS({ form: { login: { values: variables } } });
  const func = handleLoginRequest;
  const dArgs = [api.mutate, gql.Login, variables];

  // eslint-disable-next-line arrow-body-style
  it('should listen LOGIN_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(LOGIN_PAGE.LOGIN_REQUEST)
      .silentRun();
  });

  it('should dispatch loginSuccess', () => {
    const login = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM4NjAxNzUsImV4cCI6MTUxMzg2NzM3NSwiYXVkIjoidHJ5LXJlYWN0IiwiaXNzIjoidHJ5LXJlYWN0In0.Y6li_4xDg4dQALJKFqUp0NxXjUH1skPEIg41Z0aN9LE';
    const response = { login };

    return expectSaga(func)
      .withState(state)
      .put(change('login', 'password', ''))
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(globalActions.updateCredential(login))
      .put(loginPageActions.loginSuccess(response))
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
      .put(loginPageActions.loginFailure(error))
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
      .put.like({ action: loginPageActions.loginFailure({ codes: ['wgup'] }) })
      .run();
  });
});

// Watcher
describe('watcher', () => {
  // eslint-disable-next-line arrow-body-style
  it('should forward submitLogin to loginRequest', () => {
    return expectSaga(watcher)
      .provide([
        [matchers.put(loginPageActions.loginRequest())],
      ])
      .dispatch(loginPageActions.submitLogin())
      .silentRun();
  });
});
