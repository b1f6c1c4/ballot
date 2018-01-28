import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';
import { change } from 'redux-form';
import { push } from 'react-router-redux';

import * as globalActions from 'containers/Global/actions';
import * as LOGIN_PAGE from './constants';
import * as loginContainerActions from './actions';
import gql from './api.graphql';

// Sagas
export function* handleLoginRequest() {
  const json = yield select((state) => state.getIn(['form', 'login', 'values']));
  const { username, password } = json.toJS();

  yield put(change('login', 'password', ''));
  try {
    const result = yield call(api.mutate, gql.Login, { username, password });
    if (!result.login) {
      yield put(loginContainerActions.loginFailure({
        codes: ['wgup'],
        message: 'Password or username wrong',
      }));
    } else {
      yield put(globalActions.updateCredential(result.login));
      yield put(loginContainerActions.loginSuccess(result));
      yield put(push('/app/'));
    }
  } catch (err) {
    yield put(loginContainerActions.loginFailure(err));
  }
}

// Watcher
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(LOGIN_PAGE.LOGIN_REQUEST, handleLoginRequest);

  yield takeEvery(LOGIN_PAGE.SUBMIT_LOGIN_ACTION, function* () {
    yield put(loginContainerActions.loginRequest());
  });
}
