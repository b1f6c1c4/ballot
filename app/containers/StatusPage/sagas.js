import { call, put, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';

import * as STATUS_PAGE from './constants';
import * as statusPageActions from './actions';
import gql from './api.graphql';

// Sagas
export function* handleCheckStatusRequest() {
  try {
    const result = yield call(api.query, gql.Status);
    yield put(statusPageActions.checkStatusSuccess(result.status));
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
