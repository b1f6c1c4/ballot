import _ from 'lodash';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';

import * as VIEW_STAT_CONTAINER from './constants';
import * as viewStatContainerActions from './actions';
import gql from './api.graphql';

// Sagas
export function* handleBallotRequest({ bId }) {
  try {
    const result = yield call(api.query, gql.Ballot, { bId });
    yield put(viewStatContainerActions.ballotSuccess(result));
  } catch (err) {
    yield put(viewStatContainerActions.ballotFailure(err));
  }
}

export function* handleStatsRequest({ bId, max }) {
  try {
    const results = yield all(_.range(max).map((index) =>
      call(api.query, gql.FieldStat, { bId, index })));
    yield put(viewStatContainerActions.statsSuccess(results));
  } catch (err) {
    yield put(viewStatContainerActions.statsFailure(err));
  }
}

// Watcher
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(VIEW_STAT_CONTAINER.BALLOT_REQUEST, handleBallotRequest);
  yield takeEvery(VIEW_STAT_CONTAINER.STATS_REQUEST, handleStatsRequest);
}
