import { delay } from 'redux-saga';
import {
  take,
  call,
  select,
  takeEvery,
  cancel,
  race,
  fork,
  put,
} from 'redux-saga/effects';

import * as SUBSCRIPTION_CONTAINER from 'containers/SubscriptionContainer/constants';
import * as CHANGE_PASSWORD_CONTAINER from 'containers/ChangePasswordContainer/constants';
import * as CREATE_BALLOT_CONTAINER from 'containers/CreateBallotContainer/constants';
import * as SNACKBAR_CONTAINER from './constants';
import * as snackbarContainerActions from './actions';

function* handleSnackbarRequest({ message }, delayed = false) {
  if (delayed) {
    yield delay(200);
  }
  yield put(snackbarContainerActions.snackbarShow(message));
  yield delay(6000);
  yield put(snackbarContainerActions.snackbarHide());
}

function* handleStatusChange(action) {
  let name;
  const list = yield select((state) => state.getIn(['globalContainer', 'listBallots']));
  if (list) {
    const id = list.findIndex((b) => b.get('bId') === action.bId);
    if (id !== -1) {
      name = list.getIn([id, 'name']);
    }
  }
  yield put(snackbarContainerActions.snackbarRequest({ ...action, name }));
}

function* handleSimpleForward(action) {
  yield put(snackbarContainerActions.snackbarRequest(action));
}

function* resolveVoterName1(pars) {
  try {
    const bId = yield select((state) => state.getIn(['viewBallotContainer', 'ballot', 'bId']));
    if (bId !== pars.bId) return undefined;
    const ballot = yield select((state) => state.getIn(['viewBallotContainer', 'ballot', 'name']));
    const list = yield select((state) => state.getIn(['viewBallotContainer', 'ballot', 'voters']));
    const id = list.findIndex((b) => b.get('iCode') === pars.iCode);
    return {
      ballot,
      name: list.getIn([id, 'name']),
    };
  } catch (err) {
    return undefined;
  }
}

function* resolveVoterName2(pars) {
  try {
    const bId = yield select((state) => state.getIn(['editVotersContainer', 'ballot', 'bId']));
    if (bId !== pars.bId) return undefined;
    const ballot = yield select((state) => state.getIn(['editVotersContainer', 'ballot', 'name']));
    const list = yield select((state) => state.getIn(['editVotersContainer', 'voters']));
    const id = list.findIndex((b) => b.get('iCode') === pars.iCode);
    return {
      ballot,
      name: list.getIn([id, 'name']),
    };
  } catch (err) {
    return undefined;
  }
}

function* handleVoterRegistered(action) {
  const pars = { bId: action.bId, iCode: action.bId };
  let obj = yield call(resolveVoterName1, pars);
  if (!obj) {
    obj = yield call(resolveVoterName2, pars);
  }
  yield put(snackbarContainerActions.snackbarRequest({ ...action, ...obj }));
}

// Sagas

// Watcher
function* watchSnackbar() {
  let ob;
  while (true) {
    const { request, hide } = yield race({
      request: take(SNACKBAR_CONTAINER.SNACKBAR_REQUEST),
      hide: take(SNACKBAR_CONTAINER.SNACKBAR_HIDE),
    });
    if (request) {
      if (ob) {
        yield cancel(ob);
        ob = undefined;
        yield put(snackbarContainerActions.snackbarHide());
        ob = yield fork(handleSnackbarRequest, request, true);
      } else {
        ob = yield fork(handleSnackbarRequest, request);
      }
      continue;
    }
    /* istanbul ignore else */
    if (hide) {
      if (ob) {
        yield cancel(ob);
        ob = undefined;
      }
      continue;
    }
  }
}

/* eslint-disable func-names */
export default function* watcher() {
  yield fork(watchSnackbar);

  yield takeEvery(SUBSCRIPTION_CONTAINER.STATUS_CHANGE_ACTION, handleStatusChange);
  yield takeEvery(SUBSCRIPTION_CONTAINER.VOTER_REGISTERED_ACTION, handleVoterRegistered);
  yield takeEvery(CHANGE_PASSWORD_CONTAINER.PASSWORD_SUCCESS, handleSimpleForward);
  yield takeEvery(CREATE_BALLOT_CONTAINER.CREATE_BALLOT_SUCCESS, handleSimpleForward);
}
