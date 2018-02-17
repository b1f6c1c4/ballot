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
import { reset } from 'redux-form';

import * as EDIT_VOTERS_CONTAINER from './constants';
import * as editVotersContainerActions from './actions';
import gql from './api.graphql';

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
      yield put(editVotersContainerActions.voterRegistered(bId, result));
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
export function* handleCreateVoterRequest({ bId, name }) {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));

  try {
    const result = yield call(api.mutate, gql.CreateVoter, { bId, name }, cred);
    yield put(editVotersContainerActions.createVoterSuccess(result));
    yield put(reset('createVoterForm'));
  } catch (err) {
    yield put(editVotersContainerActions.createVoterFailure(err));
  }
}

export function* handleDeleteVoterRequest({ bId, iCode }) {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));

  try {
    const result = yield call(api.mutate, gql.DeleteVoter, { bId, iCode }, cred);
    yield put(editVotersContainerActions.deleteVoterSuccess(result, { iCode }));
  } catch (err) {
    yield put(editVotersContainerActions.deleteVoterFailure(err));
  }
}

export function* handleVotersRequest({ bId }) {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));

  try {
    const result = yield call(api.query, gql.Voters, { bId }, cred);
    yield put(editVotersContainerActions.votersSuccess(result));
  } catch (err) {
    yield put(editVotersContainerActions.votersFailure(err));
  }
}

// Watcher
export function* watchStatus() {
  let ob;
  let bId;
  while (true) {
    const { request, stop } = yield race({
      request: take(EDIT_VOTERS_CONTAINER.VOTER_RG_REQUEST_ACTION),
      stop: take(EDIT_VOTERS_CONTAINER.VOTER_RG_STOP_ACTION),
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
  yield takeEvery(EDIT_VOTERS_CONTAINER.CREATE_VOTER_REQUEST, handleCreateVoterRequest);
  yield takeEvery(EDIT_VOTERS_CONTAINER.VOTERS_REQUEST, handleVotersRequest);
  yield takeEvery(EDIT_VOTERS_CONTAINER.DELETE_VOTER_REQUEST, handleDeleteVoterRequest);

  yield fork(watchStatus);
}
