import _ from 'lodash';
import { eventChannel } from 'redux-saga';
import {
  take,
  call,
  race,
  fork,
  put,
  select,
  cancel,
  cancelled,
} from 'redux-saga/effects';
import * as api from 'utils/request';

import * as SUBSCRIPTION_CONTAINER from './constants';
import * as subscriptionContainerActions from './actions';
import gql from './api.graphql';

export const ballotsStatusChan = (obs0) => eventChannel((emit) => {
  const obs1 = obs0.subscribe({
    next(data) {
      const st = _.get(data, 'data.ballotsStatus');
      if (st) {
        emit(st);
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
      yield put(subscriptionContainerActions.statusChange(result));
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

export const voterRegisteredChan = (obs0) => eventChannel((emit) => {
  const obs1 = obs0.subscribe({
    next(data) {
      const st = _.get(data, 'data.voterRegistered');
      if (st) {
        emit(st);
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

export function* handleVoterRgRequestAction({ bId }) {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));

  const obs0 = yield call(api.subscribe, gql.VoterRegistered, { bId }, cred);
  const chan = yield call(voterRegisteredChan, obs0);
  try {
    while (true) {
      const result = yield take(chan);
      yield put(subscriptionContainerActions.voterRegistered(bId, result));
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

// Watcher
export function* watchStatus() {
  let ob;
  while (true) {
    const { request, stop } = yield race({
      request: take(SUBSCRIPTION_CONTAINER.STATUS_REQUEST_ACTION),
      stop: take(SUBSCRIPTION_CONTAINER.STATUS_STOP_ACTION),
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

export function* watchVoterRg() {
  let ob;
  let bId;
  while (true) {
    const { request, stop } = yield race({
      request: take(SUBSCRIPTION_CONTAINER.VOTER_RG_REQUEST_ACTION),
      stop: take(SUBSCRIPTION_CONTAINER.VOTER_RG_STOP_ACTION),
    });
    /* istanbul ignore else */
    if (request) {
      if (!ob || /* istanbul ignore next */ request.bId !== bId) {
        /* istanbul ignore if */
        if (ob) {
          yield cancel(ob);
        }
        ob = yield fork(handleVoterRgRequestAction, request);
        ({ bId } = request);
      }
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
  yield fork(watchStatus);
  yield fork(watchVoterRg);
}
