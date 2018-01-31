import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';
import { reset } from 'redux-form';

import * as EDIT_VOTERS_CONTAINER from './constants';
import * as editVotersContainerActions from './actions';
import gql from './api.graphql';

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
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(EDIT_VOTERS_CONTAINER.CREATE_VOTER_REQUEST, handleCreateVoterRequest);
  yield takeEvery(EDIT_VOTERS_CONTAINER.VOTERS_REQUEST, handleVotersRequest);
  yield takeEvery(EDIT_VOTERS_CONTAINER.DELETE_VOTER_REQUEST, handleDeleteVoterRequest);
}
