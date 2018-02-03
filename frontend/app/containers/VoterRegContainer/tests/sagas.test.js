import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import { generateKeyPair } from 'utils/crypto';

import * as VOTER_REG_CONTAINER from '../constants';
import * as voterRegContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleRegisterRequest,
  handleRefreshRequest,
} from '../sagas';

// Sagas
describe('handleRegisterRequest Saga', () => {
  const variables = { bId: 'val', iCode: 'ic', comment: 'cmt' };
  const state = fromJS({
    voterRegContainer: { ballot: { q: 'q', g: 'g' } },
  });
  const func = () => handleRegisterRequest(variables);
  const dArgs0 = [generateKeyPair, { q: 'q', g: 'g' }];
  const dResp0 = { publicKey: 'pk', privateKey: 'pv' };
  const vars = { ...variables, publicKey: 'pk' };
  const dArgs1 = [api.mutate, gql.Register, vars];

  // eslint-disable-next-line arrow-body-style
  it('should listen REGISTER_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VOTER_REG_CONTAINER.REGISTER_REQUEST)
      .silentRun();
  });

  it('should dispatch registerSuccess', () => {
    const register = 'resp';
    const response = { register };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .call(...dArgs1)
      .provide([
        [matchers.call(...dArgs0), dResp0],
        [matchers.call(...dArgs1), response],
      ])
      .put(voterRegContainerActions.registerSuccess(response, { privateKey: 'pv' }))
      .run();
  });

  it('should dispatch registerFailure 0', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .provide([
        [matchers.call(...dArgs0), throwError(error)],
      ])
      .put(voterRegContainerActions.registerFailure(error))
      .run();
  });

  it('should dispatch registerFailure 1', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .call(...dArgs1)
      .provide([
        [matchers.call(...dArgs0), dResp0],
        [matchers.call(...dArgs1), throwError(error)],
      ])
      .put(voterRegContainerActions.registerFailure(error))
      .run();
  });
});

describe('handleRefreshRequest Saga', () => {
  const variables = { bId: 'val' };
  const func = () => handleRefreshRequest(variables);
  const dArgs = [api.query, gql.Refresh, variables];

  // eslint-disable-next-line arrow-body-style
  it('should listen REFRESH_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VOTER_REG_CONTAINER.REFRESH_REQUEST)
      .silentRun();
  });

  it('should dispatch refreshSuccess', () => {
    const refresh = 'resp';
    const response = { refresh };

    return expectSaga(func)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(voterRegContainerActions.refreshSuccess(response))
      .run();
  });

  it('should dispatch refreshFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(voterRegContainerActions.refreshFailure(error))
      .run();
  });
});
