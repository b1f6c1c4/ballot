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
} from 'redux-saga/effects';
import * as api from 'utils/request';

import * as SUBSCRIPTION_CONTAINER from './constants';
import * as subscriptionContainerActions from './actions';
import gql from './api.graphql';

const close = (chan) => {
  /* istanbul ignore if */
  if (_.isObject(chan)) {
    chan.close();
  }
};

const report = (err) => {
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'test') {
    /* eslint-disable no-console */
    if (_.isArray(err)) {
      err.forEach((e) => console.error(e));
    } else {
      console.error(err);
    }
    /* eslint-enable no-console */
  }
};

export const makeChan = (lbl, obs0) => eventChannel((emit) => {
  const obs1 = obs0.subscribe({
    next(data) {
      if (_.get(data, 'errors')) {
        emit({ error: data.errors });
        return;
      }
      const result = _.get(data, `data.${lbl}`);
      if (result) {
        emit({ result });
      }
    },
    error(err) {
      /* istanbul ignore next */
      emit({ error: err });
    },
  });
  return () => obs1.unsubscribe();
});

export function* handleStatusRequestAction({ bId }) {
  const obs0 = yield call(api.subscribe, gql.BallotStatus, { bId });
  const chan = yield call(makeChan, 'ballotStatus', obs0);
  try {
    while (true) {
      const { error, result } = yield take(chan);
      if (error) throw error;
      yield put(subscriptionContainerActions.statusChange(result));
    }
  } catch (err) {
    report(err);
  } finally {
    close(chan);
  }
}

export function* handleStatusesRequestAction() {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));
  if (!cred) return;

  const obs0 = yield call(api.subscribe, gql.BallotsStatus, undefined, cred);
  const chan = yield call(makeChan, 'ballotsStatus', obs0);
  try {
    while (true) {
      const { error, result } = yield take(chan);
      if (error) throw error;
      yield put(subscriptionContainerActions.statusChange(result));
    }
  } catch (err) {
    report(err);
  } finally {
    close(chan);
  }
}

export function* handleVoterRgRequestAction({ bId }) {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));
  if (!cred) return;

  const obs0 = yield call(api.subscribe, gql.VoterRegistered, { bId }, cred);
  const chan = yield call(makeChan, 'voterRegistered', obs0);
  try {
    while (true) {
      const { error, result } = yield take(chan);
      /* istanbul ignore if */
      if (error) throw error;
      yield put(subscriptionContainerActions.voterRegistered(bId, result));
    }
  } catch (err) {
    report(err);
  } finally {
    close(chan);
  }
}

// Sagas

// Watcher
export function* watchStatus() {
  let ob;
  let bId;
  while (true) {
    const { request, requests, stop } = yield race({
      request: take(SUBSCRIPTION_CONTAINER.STATUS_REQUEST_ACTION),
      requests: take(SUBSCRIPTION_CONTAINER.STATUSES_REQUEST_ACTION),
      stop: take(SUBSCRIPTION_CONTAINER.STATUS_STOP_ACTION),
    });
    /* istanbul ignore if */
    if (ob && !ob.isRunning()) ob = undefined;
    if (request && !(ob && bId === null)) {
      if (!ob || /* istanbul ignore next */ request.bId !== bId) {
        /* istanbul ignore if */
        if (ob) {
          yield cancel(ob);
        }
        ob = yield fork(handleStatusRequestAction, request);
        ({ bId } = request);
      }
    } else if (requests && (!ob || bId !== null)) {
      /* istanbul ignore if */
      if (ob) {
        yield cancel(ob);
      }
      ob = yield fork(handleStatusesRequestAction, requests);
      bId = null;
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
    /* istanbul ignore if */
    if (ob && !ob.isRunning()) ob = undefined;
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
