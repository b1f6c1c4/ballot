import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as SUBSCRIPTION_CONTAINER from 'containers/SubscriptionContainer/constants';
import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';
import * as EDIT_VOTERS_CONTAINER from '../constants';
import * as editVotersContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleCreateVoterRequest,
  handleVotersRequest,
  handleDeleteVoterRequest,
  handleStatusRequest,
  handleVoterRgRequest,
  handleStatusChange,
} from '../sagas';

// Sagas
describe('handleCreateVoterRequest Saga', () => {
  const variables = { bId: 'b', name: 'n' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleCreateVoterRequest(variables);
  const dArgs = [api.mutate, gql.CreateVoter, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen CREATE_VOTER_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(EDIT_VOTERS_CONTAINER.CREATE_VOTER_REQUEST)
      .silentRun();
  });

  it('should dispatch createVoterSuccess', () => {
    const createVoter = 'resp';
    const response = { createVoter };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(editVotersContainerActions.createVoterSuccess(response))
      .run();
  });

  it('should dispatch createVoterFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(editVotersContainerActions.createVoterFailure(error))
      .run();
  });
});

describe('handleDeleteVoterRequest Saga', () => {
  const variables = { bId: 'b', iCode: 'c' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleDeleteVoterRequest(variables);
  const dArgs = [api.mutate, gql.DeleteVoter, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen DELETE_VOTER_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(EDIT_VOTERS_CONTAINER.DELETE_VOTER_REQUEST)
      .silentRun();
  });

  it('should dispatch deleteVoterSuccess', () => {
    const deleteVoter = 'resp';
    const response = { deleteVoter };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(editVotersContainerActions.deleteVoterSuccess(response, { iCode: 'c' }))
      .run();
  });

  it('should dispatch deleteVoterFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(editVotersContainerActions.deleteVoterFailure(error))
      .run();
  });
});

describe('handleVotersRequest Saga', () => {
  const variables = { bId: 'b' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleVotersRequest(variables);
  const dArgs = [api.query, gql.Voters, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen VOTERS_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(EDIT_VOTERS_CONTAINER.VOTERS_REQUEST)
      .silentRun();
  });

  it('should dispatch votersSuccess', () => {
    const voters = 'resp';
    const response = { voters };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(editVotersContainerActions.votersSuccess(response))
      .run();
  });

  it('should dispatch votersFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(editVotersContainerActions.votersFailure(error))
      .run();
  });
});

// Subscriptions
describe('handleStatusRequest', () => {
  const state = fromJS({
    editVotersContainer: {
      ballot: { bId: 'b', owner: 'o' },
    },
  });
  const func = handleStatusRequest;

  // eslint-disable-next-line arrow-body-style
  it('should listen STATUS_REQUEST_ACTION in the watcher', () => {
    return expectSaga(watcher)
      .take(EDIT_VOTERS_CONTAINER.STATUS_REQUEST_ACTION)
      .silentRun();
  });

  // eslint-disable-next-line arrow-body-style
  it('should not dispatch if no ballot', () => {
    return expectSaga(func)
      .withState(state.setIn(['editVotersContainer', 'ballot'], undefined))
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
    editVotersContainer: {
      ballot: { bId: 'b', status: 'inviting' },
    },
  });
  const func = handleVoterRgRequest;

  // eslint-disable-next-line arrow-body-style
  it('should listen VOTER_RG_REQUEST_ACTION in the watcher', () => {
    return expectSaga(watcher)
      .take(EDIT_VOTERS_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .silentRun();
  });

  // eslint-disable-next-line arrow-body-style
  it('should not dispatch if no ballot', () => {
    return expectSaga(func)
      .withState(state.setIn(['editVotersContainer', 'ballot'], undefined))
      .not.put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .run();
  });

  // eslint-disable-next-line arrow-body-style
  it('should not dispatch if bad status', () => {
    return expectSaga(func)
      .withState(state.setIn(['editVotersContainer', 'ballot', 'status'], 'unknown'))
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
    editVotersContainer: { ballot: { bId: 'b' } },
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
      .withState(state.setIn(['editVotersContainer', 'ballot'], undefined))
      .not.put.actionType(EDIT_VOTERS_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .not.put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_STOP_ACTION)
      .run();
  });

  // eslint-disable-next-line arrow-body-style
  it('should not dispatch if not match', () => {
    return expectSaga(func, { bId: 'b3', status: 'inviting' })
      .withState(state)
      .not.put.actionType(EDIT_VOTERS_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .not.put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_STOP_ACTION)
      .run();
  });

  // eslint-disable-next-line arrow-body-style
  it('should dispatch voterRgRequest', () => {
    return expectSaga(func, { bId: 'b', status: 'inviting' })
      .withState(state)
      .put.actionType(EDIT_VOTERS_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .not.put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_STOP_ACTION)
      .run();
  });

  // eslint-disable-next-line arrow-body-style
  it('should dispatch voterRgStop', () => {
    return expectSaga(func, { bId: 'b', status: 'unknown' })
      .withState(state)
      .not.put.actionType(EDIT_VOTERS_CONTAINER.VOTER_RG_REQUEST_ACTION)
      .put.actionType(SUBSCRIPTION_CONTAINER.VOTER_RG_STOP_ACTION)
      .run();
  });
});
