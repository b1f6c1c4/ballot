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

import watcher, {
  handleLoginRequest,
} from '../sagas';

// Sagas
describe('handleLoginRequest Saga', () => {
  const values = {
    key: 'value',
  };
  const state = fromJS({
    form: {
      login: {
        values,
      },
    },
  });

  // eslint-disable-next-line arrow-body-style
  it('should listen LOGIN_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(LOGIN_PAGE.LOGIN_REQUEST)
      .silentRun();
  });

  it('should dispatch the loginSuccess action if it requests the credential successfully', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTM4NjAxNzUsImV4cCI6MTUxMzg2NzM3NSwiYXVkIjoidHJ5LXJlYWN0IiwiaXNzIjoidHJ5LXJlYWN0In0.Y6li_4xDg4dQALJKFqUp0NxXjUH1skPEIg41Z0aN9LE';
    const response = {
      message: 'ok',
      token,
    };

    return expectSaga(handleLoginRequest, api)
      .withState(state)
      .put(change('login', 'password', ''))
      .call(api.POST, '/login', undefined, values)
      .provide([
        [matchers.call(api.POST, '/login', undefined, values), response],
      ])
      .put(globalActions.updateCredential(token))
      .put(loginPageActions.loginSuccess(response))
      .put(push('/app/'))
      .run();
  });

  it('should call the loginFailure action if the response errors', () => {
    const error = new Error('value');

    return expectSaga(handleLoginRequest, api)
      .withState(state)
      .call(api.POST, '/login', undefined, values)
      .provide([
        [matchers.call(api.POST, '/login', undefined, values), throwError(error)],
      ])
      .put(loginPageActions.loginFailure(error))
      .run();
  });

  it('should call the loginFailure action if the response malformated', () => {
    const response = {
      message: 'ok',
    };

    return expectSaga(handleLoginRequest, api)
      .withState(state)
      .call(api.POST, '/login', undefined, values)
      .provide([
        [matchers.call(api.POST, '/login', undefined, values), response],
      ])
      .put.actionType(LOGIN_PAGE.LOGIN_FAILURE)
      .run();
  });

  it('should call the loginFailure action if the response message not ok', () => {
    const response = {
      message: 'not ok',
    };

    return expectSaga(handleLoginRequest, api)
      .withState(state)
      .call(api.POST, '/login', undefined, values)
      .provide([
        [matchers.call(api.POST, '/login', undefined, values), response],
      ])
      .put.actionType(LOGIN_PAGE.LOGIN_FAILURE)
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
