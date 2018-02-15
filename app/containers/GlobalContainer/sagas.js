import _ from 'lodash';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';
import { push } from 'react-router-redux';

import * as globalContainerSelectors from './selectors';
import * as GLOBAL_CONTAINER from './constants';
import * as globalContainerActions from './actions';
import gql from './api.graphql';

export function* handleStatusRequestAction() {
  const obs = yield select(globalContainerSelectors.StatusObservable());
  if (obs) return;

  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));

  try {
    const obs0 = yield call(api.subscribe, gql.BallotsStatus, undefined, cred);
    const obs1 = obs0.subscribe({
      next(data) {
        const st = _.get(data, 'data.ballotsStatus');
        if (st) {
          yield put(globalContainerActions.statusChange(st));
        }
      },
      error(err) {
        console.error(err);
      },
    });
    yield put(globalContainerActions.statusStart(obs1));
  } catch (err) {
    console.error(err);
  }
}

// Sagas
export function* handleBallotsRequest() {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));

  try {
    const result = yield call(api.query, gql.Ballots, undefined, cred);
    yield put(globalContainerActions.ballotsSuccess(result));
  } catch (err) {
    yield put(globalContainerActions.ballotsFailure(err));
  }
}

// Watcher
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(GLOBAL_CONTAINER.BALLOTS_REQUEST, handleBallotsRequest);

  yield takeEvery(GLOBAL_CONTAINER.STATUS_REQUEST_ACTION, handleStatusRequestAction);

  yield takeEvery(GLOBAL_CONTAINER.LOGIN_ACTION, function* () {
    yield put(globalContainerActions.ballotsRequest());
    yield put(globalContainerActions.statusRequest());
  });

  yield takeEvery(GLOBAL_CONTAINER.LOGOUT_ACTION, function* () {
    yield put(push('/app/login'));
    yield put(globalContainerActions.statusStop());
  });
}
