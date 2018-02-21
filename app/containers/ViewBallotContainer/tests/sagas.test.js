import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import downloadCsv from 'download-csv';

import * as SUBSCRIPTION_CONTAINER from 'containers/SubscriptionContainer/constants';
import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';
import * as VIEW_BALLOT_CONTAINER from '../constants';
import * as viewBallotContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleBallotRequest,
  handleFinalizeRequest,
  handleExportRequest,
  handleStatusRequest,
  handleVoterRgRequest,
  handleStatusChange,
} from '../sagas';

// Sagas
describe('handleBallotRequest Saga', () => {
  const variables = { bId: 'value' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleBallotRequest(variables);
  const dArgs = [api.query, gql.Ballot, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen BALLOT_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_BALLOT_CONTAINER.BALLOT_REQUEST)
      .silentRun();
  });

  it('should dispatch ballotSuccess', () => {
    const ballot = 'resp';
    const response = { ballot };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(viewBallotContainerActions.ballotSuccess(response))
      .run();
  });

  it('should dispatch ballotFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(viewBallotContainerActions.ballotFailure(error))
      .run();
  });
});

describe('handleFinalizeRequest Saga', () => {
  const variables = { bId: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
    viewBallotContainer: { ballot: { status: 'unknown' } },
  });
  const func = () => handleFinalizeRequest(variables);
  const dArgs = (m) => [api.mutate, m, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen FINALIZE_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_BALLOT_CONTAINER.FINALIZE_REQUEST)
      .silentRun();
  });

  it('should dispatch finalizeSuccess inviting', () => {
    const finalize = 'resp';
    const response = { finalize };

    return expectSaga(func)
      .withState(state.setIn(['viewBallotContainer', 'ballot', 'status'], 'inviting'))
      .call(...dArgs(gql.FinalizeVoters))
      .provide([
        [matchers.call(...dArgs(gql.FinalizeVoters)), response],
      ])
      .put(viewBallotContainerActions.finalizeSuccess(response))
      .run();
  });

  it('should dispatch finalizeSuccess invited', () => {
    const finalize = 'resp';
    const response = { finalize };

    return expectSaga(func)
      .withState(state.setIn(['viewBallotContainer', 'ballot', 'status'], 'invited'))
      .call(...dArgs(gql.FinalizeFields))
      .provide([
        [matchers.call(...dArgs(gql.FinalizeFields)), response],
      ])
      .put(viewBallotContainerActions.finalizeSuccess(response))
      .run();
  });

  it('should dispatch finalizeSuccess pre voting', () => {
    const finalize = 'resp';
    const response = { finalize };

    return expectSaga(func)
      .withState(state.setIn(['viewBallotContainer', 'ballot', 'status'], 'preVoting'))
      .call(...dArgs(gql.FinalizePreVoting))
      .provide([
        [matchers.call(...dArgs(gql.FinalizePreVoting)), response],
      ])
      .put(viewBallotContainerActions.finalizeSuccess(response))
      .run();
  });

  it('should dispatch finalizeSuccess voting', () => {
    const finalize = 'resp';
    const response = { finalize };

    return expectSaga(func)
      .withState(state.setIn(['viewBallotContainer', 'ballot', 'status'], 'voting'))
      .call(...dArgs(gql.FinalizeVoting))
      .provide([
        [matchers.call(...dArgs(gql.FinalizeVoting)), response],
      ])
      .put(viewBallotContainerActions.finalizeSuccess(response))
      .run();
  });

  // eslint-disable-next-line arrow-body-style
  it('should dispatch finalizeFailure unknown', () => {
    return expectSaga(func)
      .withState(state)
      .put(viewBallotContainerActions.finalizeFailure({ codes: ['stna'] }))
      .run();
  });

  it('should dispatch finalizeFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state.setIn(['viewBallotContainer', 'ballot', 'status'], 'voting'))
      .call(...dArgs(gql.FinalizeVoting))
      .provide([
        [matchers.call(...dArgs(gql.FinalizeVoting)), throwError(error)],
      ])
      .put(viewBallotContainerActions.finalizeFailure(error))
      .run();
  });
});

describe('handleExportRequest Saga', () => {
  const variables = { bId: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleExportRequest(variables);
  const dArgs0 = [api.query, gql.BallotCrypto, variables, 'cre'];
  const dArgs1 = [downloadCsv, [{ k: 'v' }], null, 'crypto.csv'];

  // eslint-disable-next-line arrow-body-style
  it('should listen EXPORT_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_BALLOT_CONTAINER.EXPORT_REQUEST)
      .silentRun();
  });

  it('should dispatch exportSuccess', () => {
    const ballot = { k: 'v', __typename: 't' };
    const response = { ballot };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .call(...dArgs1)
      .provide([
        [matchers.call(...dArgs0), response],
        [matchers.call(...dArgs1), undefined],
      ])
      .put(viewBallotContainerActions.exportSuccess(response))
      .run();
  });

  it('should dispatch exportFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .provide([
        [matchers.call(...dArgs0), throwError(error)],
      ])
      .put(viewBallotContainerActions.exportFailure(error))
      .run();
  });
});

// Subscriptions
describe('handleStatusRequest', () => {
  const state = fromJS({
    viewBallotContainer: {
      ballot: { bId: 'b', owner: 'o' },
    },
  });
  const func = handleStatusRequest;

  // eslint-disable-next-line arrow-body-style
  it('should listen STATUS_REQUEST_ACTION in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_BALLOT_CONTAINER.STATUS_REQUEST_ACTION)
      .silentRun();
  });

  // eslint-disable-next-line arrow-body-style
  it('should not dispatch if no ballot', () => {
    return expectSaga(func)
      .withState(state.setIn(['viewBallotContainer', 'ballot'], undefined))
      .not.put.actionType(SUBSCRIPTION_CONTAINER.STATUS_REQUEST_ACTION)
      .run();
  });

  it('should dispatch statusRequest', () => {
    const response = { bId: 'b', owner: 'o' };

    return expectSaga(func)
      .withState(state)
      .put(subscriptionContainerActions.statusRequest(response))
      .run();
  });
});

describe('handleVoterRgRequest', () => {
  const state = fromJS({
    viewBallotContainer: {
      ballot: { bId: 'b', status: 'inviting' },
    },
  });
  const func = handleVoterRgRequest;

  // eslint-disable-next-line arrow-body-style
  it('should listen VOTER_RG_REQUEST_ACTION in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_BALLOT_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .silentRun();
  });

  // eslint-disable-next-line arrow-body-style
  it('should not dispatch if no ballot', () => {
    return expectSaga(func)
      .withState(state.setIn(['viewBallotContainer', 'ballot'], undefined))
      .not.put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .run();
  });

  // eslint-disable-next-line arrow-body-style
  it('should not dispatch if bad status', () => {
    return expectSaga(func)
      .withState(state.setIn(['viewBallotContainer', 'ballot', 'status'], 'unknown'))
      .not.put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .run();
  });

  it('should dispatch voterRgRequest', () => {
    const response = { bId: 'b' };

    return expectSaga(func)
      .withState(state)
      .put(subscriptionContainerActions.voterRgRequest(response))
      .run();
  });
});

describe('handleStatusChange', () => {
  const state = fromJS({
    viewBallotContainer: { ballot: { bId: 'b' } },
  });
  const func = handleStatusChange;

  // eslint-disable-next-line arrow-body-style
  it('should listen STATUS_CHANGE_ACTION in the watcher', () => {
    return expectSaga(watcher)
      .take(SUBSCRIPTION_CONTAINER.STATUS_CHANGE_ACTION)
      .silentRun();
  });

  // eslint-disable-next-line arrow-body-style
  it('should not dispatch if no ballot', () => {
    return expectSaga(func, { bId: 'b', status: 'inviting' })
      .withState(state.setIn(['viewBallotContainer', 'ballot'], undefined))
      .not.put.actionType(VIEW_BALLOT_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .not.put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_STOP_ACTION)
      .run();
  });

  // eslint-disable-next-line arrow-body-style
  it('should not dispatch if not match', () => {
    return expectSaga(func, { bId: 'b3', status: 'inviting' })
      .withState(state)
      .not.put.actionType(VIEW_BALLOT_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .not.put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_STOP_ACTION)
      .run();
  });

  // eslint-disable-next-line arrow-body-style
  it('should dispatch voterRgRequest', () => {
    return expectSaga(func, { bId: 'b', status: 'inviting' })
      .withState(state)
      .put.actionType(VIEW_BALLOT_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .not.put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_STOP_ACTION)
      .run();
  });

  // eslint-disable-next-line arrow-body-style
  it('should dispatch voterRgStop', () => {
    return expectSaga(func, { bId: 'b', status: 'unknown' })
      .withState(state)
      .not.put.actionType(VIEW_BALLOT_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_STOP_ACTION)
      .run();
  });
});
