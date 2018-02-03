import _ from 'lodash';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as api from 'utils/request';
import { change, reset, initialize, stopSubmit } from 'redux-form';
import { signMessage } from 'utils/crypto';

import * as PRE_VOTING_CONTAINER from './constants';
import * as preVotingContainerSelectors from './selectors';
import * as preVotingContainerActions from './actions';
import gql from './api.graphql';

// Sagas
export function* handleRefreshRequest({ bId }) {
  yield put(reset('preVotingForm'));
  try {
    const result = yield call(api.query, gql.Refresh, { bId });
    yield put(preVotingContainerActions.refreshSuccess(result));
    const values = _.fromPairs(_.map(result.ballot.fields, (f, i) => {
      // eslint-disable-next-line no-underscore-dangle
      switch (f.__typename) {
        case 'StringField':
          return [String(i), f.default];
        case 'EnumField':
        default:
          return [String(i), undefined];
      }
    }));
    yield put(initialize('preVotingForm', values, {
      updateUnregisteredFields: true,
    }));
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
  const ys = _.map(voters, 'publicKey');

  try {
    const result = yield call(signMessage, payload, {
      q,
      g,
      h,
      x: privateKey,
      ys,
    });
    yield put(preVotingContainerActions.signSuccess(result));
    yield change('preVotingForm', { privateKey: '' });
  } catch (err) {
    yield put(preVotingContainerActions.signFailure(err));
    yield put(stopSubmit('preVotingForm', { _error: err }));
  }
}

// Watcher
/* eslint-disable func-names */
export default function* watcher() {
  yield takeEvery(PRE_VOTING_CONTAINER.REFRESH_REQUEST, handleRefreshRequest);
  yield takeEvery(PRE_VOTING_CONTAINER.SIGN_REQUEST, handleSignRequest);
}
