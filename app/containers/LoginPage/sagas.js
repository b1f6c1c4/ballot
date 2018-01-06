import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';
import { change } from 'redux-form';
import { push } from 'react-router-redux';

import * as globalActions from 'containers/Global/actions';
import * as LOGIN_PAGE from './constants';
import * as loginPageActions from './actions';

// Sagas
export function* handleLoginRequest() {
  const json = yield select((state) => state.getIn(['form', 'login', 'values']).toJS());

  yield put(change('login', 'password', ''));
  try {
    const result = yield call(api.POST, '/login', undefined, json);
    if (result.message !== 'ok') {
      yield put(loginPageActions.loginFailure({
        message: 'Server said no',
        result,
      }));
    } else if (!result.token) {
      yield put(loginPageActions.loginFailure({
        message: 'Unrecognized server response',
        result,
      }));
    } else {
      yield put(globalActions.updateCredential(result.token));
      yield put(loginPageActions.loginSuccess(result));
      yield put(push('/app/'));
    }
  } catch (err) {
    yield put(loginPageActions.loginFailure(err));
  }
}

// Watcher
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(LOGIN_PAGE.LOGIN_REQUEST, handleLoginRequest);

  yield takeEvery(LOGIN_PAGE.SUBMIT_LOGIN_ACTION, function* () {
    yield put(loginPageActions.loginRequest());
  });
}
