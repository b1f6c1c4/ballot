import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';
import { change } from 'redux-form';
import { push } from 'react-router-redux';

import * as globalActions from 'containers/Global/actions';
import * as LOGIN_CONTAINER from './constants';
import * as loginContainerActions from './actions';
import gql from './api.graphql';

// Sagas
export function* handleLoginRequest() {
  const json = yield select((state) => state.getIn(['form', 'loginPage', 'values']));
  const { username, password } = json.toJS();

  yield put(change('loginPage', 'password', ''));
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

export function* handleRegisterRequest() {
  const json = yield select((state) => state.getIn(['form', 'loginPage', 'values']));
  const { username, password } = json.toJS();

  yield put(change('loginPage', 'password', ''));
  try {
    const result = yield call(api.mutate, gql.Register, { username, password });
    yield put(loginContainerActions.registerSuccess(result));
  } catch (err) {
    yield put(loginContainerActions.registerFailure(err));
  }
}

// Watcher
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(LOGIN_CONTAINER.LOGIN_REQUEST, handleLoginRequest);
  yield takeEvery(LOGIN_CONTAINER.REGISTER_REQUEST, handleRegisterRequest);

  yield takeEvery(LOGIN_CONTAINER.SUBMIT_LOGIN_ACTION, function* () {
    yield put(loginContainerActions.loginRequest());
  });
}
