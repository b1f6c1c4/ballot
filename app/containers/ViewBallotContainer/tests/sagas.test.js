import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as VIEW_BALLOT_CONTAINER from '../constants';
import * as viewBallotContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleBallotRequest,
  handleFinalizeRequest,
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
      .put(viewBallotContainerActions.ballotRequest({ bId: 'val' }))
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
      .put(viewBallotContainerActions.ballotRequest({ bId: 'val' }))
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
      .put(viewBallotContainerActions.ballotRequest({ bId: 'val' }))
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
      .put(viewBallotContainerActions.ballotRequest({ bId: 'val' }))
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
