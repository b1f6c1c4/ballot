import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';
import {
  change,
  reset,
  destroy,
  startSubmit,
  stopSubmit,
  setSubmitSucceeded,
} from 'redux-form';
import { push } from 'react-router-redux';

import * as globalActions from 'containers/Global/actions';
import * as LOGIN_CONTAINER from './constants';
import * as loginContainerActions from './actions';
import gql from './api.graphql';

// Sagas
export function* handleLoginRequest() {
  const json = yield select((state) => state.getIn(['form', 'loginForm', 'values']));
  const { username, password } = json.toJS();

  try {
    const result = yield call(api.mutate, gql.Login, { username, password });
    if (!result.login) {
      const e = new Error('Credential not accepted');
      e.codes = ['wgup'];
      throw e;
    } else {
      yield put(globalActions.updateCredential(result.login));
      yield put(loginContainerActions.loginSuccess(result));
      yield put(destroy('loginForm'));
      yield put(push('/app/'));
    }
  } catch (err) {
    yield put(loginContainerActions.loginFailure(err));
    yield put(stopSubmit('loginForm', { _error: err }));
  }
}

export function* handleRegisterRequest() {
  const json = yield select((state) => state.getIn(['form', 'registerForm', 'values']));
  const { username, password } = json.toJS();

  yield put(startSubmit('registerForm'));
  try {
    const result = yield call(api.mutate, gql.Register, { username, password });
    yield put(loginContainerActions.registerSuccess(result));
    yield put(setSubmitSucceeded('registerForm'));
    yield put(destroy('registerForm'));
    yield put(loginContainerActions.changeActiveId(0));
    yield put(reset('loginForm'));
    yield put(change('loginForm', 'username', username));
  } catch (err) {
    yield put(loginContainerActions.registerFailure(err));
    yield put(stopSubmit('registerForm', { _error: err }));
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
  yield takeEvery(LOGIN_CONTAINER.SUBMIT_REGISTER_ACTION, function* () {
    yield put(loginContainerActions.registerRequest());
  });
}
