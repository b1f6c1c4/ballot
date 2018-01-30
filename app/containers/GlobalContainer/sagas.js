import { put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import * as GLOBAL_CONTAINER from './constants';

// Sagas

// Watcher
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(GLOBAL_CONTAINER.LOGOUT_ACTION, function* () {
    yield put(push('/app/login'));
  });
}
