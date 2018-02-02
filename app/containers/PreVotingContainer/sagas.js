import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';
import { signMessage } from 'utils/crypto';

import * as PRE_VOTING_CONTAINER from './constants';
import * as preVotingContainerSelectors from './selectors';
import * as preVotingContainerActions from './actions';
import gql from './api.graphql';

// Sagas
export function* handleRefreshRequest({ bId }) {
  try {
    const result = yield call(api.query, gql.Refresh, { bId });
    yield put(preVotingContainerActions.refreshSuccess(result));
  } catch (err) {
    yield put(preVotingContainerActions.refreshFailure(err));
  }
}

export function* handleSignRequest({ payload, privateKey }) {
  const {
    q,
    g,
    h,
    voters,
  } = yield select(preVotingContainerSelectors.Ballot());
  const ys = voters.map((v) => v.publicKey);

  try {
    const result = yield call(signMessage, payload, {
      q,
      g,
      h,
      x: privateKey,
      ys,
    });
    yield put(preVotingContainerActions.signSuccess(result));
  } catch (err) {
    yield put(preVotingContainerActions.signFailure(err));
  }
}

// Watcher
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(PRE_VOTING_CONTAINER.REFRESH_REQUEST, handleRefreshRequest);
  yield takeEvery(PRE_VOTING_CONTAINER.SIGN_REQUEST, handleSignRequest);
}
