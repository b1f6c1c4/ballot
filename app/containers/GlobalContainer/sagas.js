import _ from 'lodash';
import { eventChannel } from 'redux-saga';
import {
  take,
  call,
  race,
  fork,
  put,
  select,
  takeEvery,
  cancel,
  cancelled,
} from 'redux-saga/effects';
import * as api from 'utils/request';
import { push } from 'react-router-redux';

import * as GLOBAL_CONTAINER from './constants';
import * as globalContainerActions from './actions';
import gql from './api.graphql';

export const ballotsStatusChan = (obs0) => eventChannel((emit) => {
  const obs1 = obs0.subscribe({
    next(data) {
      const st = _.get(data, 'data.ballotsStatus');
      if (st) {
        emit(globalContainerActions.statusChange(st));
      }
    },
    error(err) {
      /* istanbul ignore next */
      // eslint-disable-next-line no-console
      console.error(err);
    },
  });
  return () => obs1.unsubscribe();
});

export function* handleStatusRequestAction() {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));

  const obs0 = yield call(api.subscribe, gql.BallotsStatus, undefined, cred);
  const chan = yield call(ballotsStatusChan, obs0);
  try {
    while (true) {
      const result = yield take(chan);
      yield put(globalContainerActions.statusChange(result));
    }
  } finally {
    /* istanbul ignore else */
    if (yield cancelled()) {
      /* istanbul ignore if */
      if (_.isObject(chan)) {
        chan.close();
      }
    }
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
export function* watchStatus() {
  let ob;
  while (true) {
    const { request, stop } = yield race({
      request: take(GLOBAL_CONTAINER.STATUS_REQUEST_ACTION),
      stop: take(GLOBAL_CONTAINER.STATUS_STOP_ACTION),
    });
    if (request && !ob) {
      ob = yield fork(handleStatusRequestAction, request);
    } /* istanbul ignore next */ else if (stop && ob) {
      /* istanbul ignore next */
      yield cancel(ob);
      /* istanbul ignore next */
      ob = undefined;
    }
  }
}

/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(GLOBAL_CONTAINER.BALLOTS_REQUEST, handleBallotsRequest);

  yield fork(watchStatus);

  yield takeEvery(GLOBAL_CONTAINER.LOGIN_ACTION, function* () {
    yield put(globalContainerActions.ballotsRequest());
    yield put(globalContainerActions.statusRequest());
  });

  yield takeEvery(GLOBAL_CONTAINER.LOGOUT_ACTION, function* () {
    yield put(push('/app/login'));
    yield put(globalContainerActions.statusStop());
  });
}
