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
import downloadCsv from 'download-csv';

import * as VIEW_BALLOT_CONTAINER from './constants';
import * as viewBallotContainerSelectors from './selectors';
import * as viewBallotContainerActions from './actions';
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
      yield put(viewBallotContainerActions.voterRegistered({
        bId,
        ...result,
      }));
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
export function* handleBallotRequest({ bId }) {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));

  try {
    const result = yield call(api.query, gql.Ballot, { bId }, cred);
    yield put(viewBallotContainerActions.ballotSuccess(result));
  } catch (err) {
    yield put(viewBallotContainerActions.ballotFailure(err));
  }
}

export function* handleFinalizeRequest({ bId }) {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));
  const ballot = yield select(viewBallotContainerSelectors.Ballot());
  const { status } = ballot;

  let mutation;
  switch (status) {
    case 'inviting':
      mutation = gql.FinalizeVoters;
      break;
    case 'invited':
      mutation = gql.FinalizeFields;
      break;
    case 'preVoting':
      mutation = gql.FinalizePreVoting;
      break;
    case 'voting':
      mutation = gql.FinalizeVoting;
      break;
    default:
      yield put(viewBallotContainerActions.finalizeFailure({ codes: ['stna'] }));
      break;
  }

  try {
    const result = yield call(api.mutate, mutation, { bId }, cred);
    yield put(viewBallotContainerActions.finalizeSuccess(result));
  } catch (err) {
    yield put(viewBallotContainerActions.finalizeFailure(err));
  }
}

export function* handleExportRequest({ bId }) {
  const cred = yield select((state) => state.getIn(['globalContainer', 'credential', 'token']));

  try {
    const result = yield call(api.query, gql.BallotCrypto, { bId }, cred);
    const table = [_.omit(result.ballot, '__typename')];
    yield call(downloadCsv, table, null, 'crypto.csv');
    yield put(viewBallotContainerActions.exportSuccess(result));
  } catch (err) {
    yield put(viewBallotContainerActions.exportFailure(err));
  }
}

// Watcher
export function* watchStatus() {
  let ob;
  let bId;
  while (true) {
    const { request, stop } = yield race({
      request: take(VIEW_BALLOT_CONTAINER.VOTER_RG_REQUEST_ACTION),
      stop: take(VIEW_BALLOT_CONTAINER.VOTER_RG_STOP_ACTION),
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
  yield takeEvery(VIEW_BALLOT_CONTAINER.BALLOT_REQUEST, handleBallotRequest);
  yield takeEvery(VIEW_BALLOT_CONTAINER.FINALIZE_REQUEST, handleFinalizeRequest);
  yield takeEvery(VIEW_BALLOT_CONTAINER.EXPORT_REQUEST, handleExportRequest);

  yield fork(watchStatus);
}
