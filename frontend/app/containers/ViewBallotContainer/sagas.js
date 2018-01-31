import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';

import * as VIEW_BALLOT_CONTAINER from './constants';
import * as viewBallotContainerActions from './actions';
import gql from './api.graphql';

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

// Watcher
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(VIEW_BALLOT_CONTAINER.BALLOT_REQUEST, handleBallotRequest);
}
