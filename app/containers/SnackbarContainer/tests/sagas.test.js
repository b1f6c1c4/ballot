import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';
import * as SNACKBAR_CONTAINER from '../constants';
import * as snackbarContainerActions from '../actions';

import watcher, {
  handleSnackbarRequest,
  handleSimpleForward,
  handleStatusChange,
  resolveVoterName1,
  resolveVoterName2,
  handleVoterRegistered,
  watchSnackbar,
} from '../sagas';

describe('handleSnackbarRequest', () => {
  it('should put show and hide undelayed', () => {
    const message = { k: 'v' };

    return expectSaga(handleSnackbarRequest, { message })
      .put(snackbarContainerActions.snackbarShow(message))
      .put(snackbarContainerActions.snackbarHide())
      .run();
  });

  it('should put show and hide delayed', () => {
    const message = { k: 'v' };

    return expectSaga(handleSnackbarRequest, { message }, true)
      .put(snackbarContainerActions.snackbarShow(message))
      .put(snackbarContainerActions.snackbarHide())
      .run();
  });
});

describe('handleSimpleForward', () => {
  it('should handle good', () => {
    const action = { k: 'v' };

    return expectSaga(handleSimpleForward, action)
      .put(snackbarContainerActions.snackbarRequest(action))
      .run();
  });
});

describe('handleStatusChange', () => {
  const state = fromJS({
    globalContainer: {
      listBallots: [
        { bId: '1', name: 'a' },
      ],
    },
  });

  it('should handle null', () => {
    const action = subscriptionContainerActions.statusChange({ bId: 'b', status: 's' });

    return expectSaga(handleStatusChange, action)
      .withState(state.setIn(['globalContainer', 'listBallots'], undefined))
      .put(snackbarContainerActions.snackbarRequest({ ...action, name: undefined }))
      .run();
  });

  it('should handle not match', () => {
    const action = subscriptionContainerActions.statusChange({ bId: 'b', status: 's' });

    return expectSaga(handleStatusChange, action)
      .withState(state)
      .put(snackbarContainerActions.snackbarRequest({ ...action, name: undefined }))
      .run();
  });

  it('should handle good', () => {
    const action = subscriptionContainerActions.statusChange({ bId: '1', status: 's' });

    return expectSaga(handleStatusChange, action)
      .withState(state)
      .put(snackbarContainerActions.snackbarRequest({ ...action, name: 'a' }))
      .run();
  });
});

describe('resolveVoterName1', () => {
  const state = fromJS({
    viewBallotContainer: {
      ballot: {
        bId: '1',
        name: 'a',
        voters: [
          { iCode: '2', name: 'b' },
        ],
      },
    },
  });

  it('should handle null', () => {
    const action = subscriptionContainerActions.voterRegistered('b', { iCode: '2', k: 'v' });

    return expectSaga(resolveVoterName1, action)
      .withState(state.setIn(['globalContainer', 'listBallots'], undefined))
      .returns(undefined)
      .run();
  });

  it('should handle not match', () => {
    const action = subscriptionContainerActions.voterRegistered('1', { iCode: '3', k: 'v' });

    return expectSaga(resolveVoterName1, action)
      .withState(state)
      .returns(undefined)
      .run();
  });

  it('should handle good', () => {
    const action = subscriptionContainerActions.voterRegistered('1', { iCode: '2', k: 'v' });

    return expectSaga(resolveVoterName1, action)
      .withState(state)
      .returns({ ballot: 'a', name: 'b' })
      .run();
  });
});

describe('resolveVoterName2', () => {
  const state = fromJS({
    editVotersContainer: {
      ballot: {
        bId: '1',
        name: 'a',
      },
      voters: [
        { iCode: '2', name: 'b' },
      ],
    },
  });

  it('should handle null', () => {
    const action = subscriptionContainerActions.voterRegistered('b', { iCode: '2', k: 'v' });

    return expectSaga(resolveVoterName2, action)
      .withState(state.setIn(['globalContainer', 'listBallots'], undefined))
      .returns(undefined)
      .run();
  });

  it('should handle not match', () => {
    const action = subscriptionContainerActions.voterRegistered('1', { iCode: '3', k: 'v' });

    return expectSaga(resolveVoterName2, action)
      .withState(state)
      .returns(undefined)
      .run();
  });

  it('should handle good', () => {
    const action = subscriptionContainerActions.voterRegistered('1', { iCode: '2', k: 'v' });

    return expectSaga(resolveVoterName2, action)
      .withState(state)
      .returns({ ballot: 'a', name: 'b' })
      .run();
  });
});

describe('handleVoterRegistered', () => {
  it('should call resolveVoterName1 success', () => {
    const action = subscriptionContainerActions.voterRegistered('1', { iCode: '2', k: 'v' });
    const obj = { k: 'v' };

    return expectSaga(handleVoterRegistered, action)
      .call(resolveVoterName1, action)
      .provide([
        [matchers.call(resolveVoterName1, action), obj],
      ])
      .put(snackbarContainerActions.snackbarRequest({ ...action, ...obj }))
      .run();
  });

  it('should call resolveVoterName2 success', () => {
    const action = subscriptionContainerActions.voterRegistered('1', { iCode: '2', k: 'v' });
    const obj = { k: 'v' };

    return expectSaga(handleVoterRegistered, action)
      .call(resolveVoterName1, action)
      .call(resolveVoterName2, action)
      .provide([
        [matchers.call(resolveVoterName1, action), undefined],
        [matchers.call(resolveVoterName2, action), obj],
      ])
      .put(snackbarContainerActions.snackbarRequest({ ...action, ...obj }))
      .run();
  });

  it('should call both fail', () => {
    const action = subscriptionContainerActions.voterRegistered('1', { iCode: '2', k: 'v' });

    return expectSaga(handleVoterRegistered, action)
      .call(resolveVoterName1, action)
      .call(resolveVoterName2, action)
      .provide([
        [matchers.call(resolveVoterName1, action), undefined],
        [matchers.call(resolveVoterName2, action), undefined],
      ])
      .put(snackbarContainerActions.snackbarRequest({ ...action }))
      .run();
  });
});

// Sagas

// Watcher
const mockOb = () => ({
  isRunning: () => true,
});

describe('watchSnackbar', () => {
  it('should take request', async (done) => {
    const req = snackbarContainerActions.snackbarRequest('x');
    const ob = mockOb();

    await expectSaga(watchSnackbar)
      .fork(handleSnackbarRequest, req)
      .provide([
        [matchers.fork(handleSnackbarRequest, req), ob],
      ])
      .dispatch(req)
      .silentRun();

    expect(ob.isRunning()).toEqual(true);
    done();
  });

  it('should take request and cancel', async (done) => {
    const req = snackbarContainerActions.snackbarRequest('x');
    const ob1 = mockOb();
    const ob2 = mockOb();

    await expectSaga(watchSnackbar)
      .fork(handleSnackbarRequest, req)
      .fork(handleSnackbarRequest, req, true)
      .provide([
        [matchers.fork(handleSnackbarRequest, req), ob1],
        [matchers.fork(handleSnackbarRequest, req, true), ob2],
      ])
      .dispatch(req)
      .dispatch(req)
      .silentRun();

    expect(ob1.isRunning()).toEqual(false);
    expect(ob2.isRunning()).toEqual(true);
    done();
  });

  // eslint-disable-next-line arrow-body-style
  it('should listen in the watcher', () => {
    return expectSaga(watcher)
      .take(SNACKBAR_CONTAINER.SNACKBAR_REQUEST_ACTION)
      .silentRun();
  });
});
