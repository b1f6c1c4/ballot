import { call, put, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';

import * as STATUS_PAGE from './constants';
import * as statusPageActions from './actions';

// Sagas
export function* handleCheckStatusRequest() {
  try {
    const result = yield call(api.GET, '/', undefined);
    yield put(statusPageActions.checkStatusSuccess(result));
  } catch (err) {
    yield put(statusPageActions.checkStatusFailure(err));
  }
}

// Watcher
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(STATUS_PAGE.CHECK_STATUS_REQUEST, handleCheckStatusRequest);

  yield takeEvery(STATUS_PAGE.FETCH_STATUS_ACTION, function* () {
    yield put(statusPageActions.checkStatusRequest());
  });
}
