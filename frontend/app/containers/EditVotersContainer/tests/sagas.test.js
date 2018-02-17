import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError, dynamic } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as EDIT_VOTERS_CONTAINER from '../constants';
import * as editVotersContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  voterRegisteredChan,
  handleVoterRgRequestAction,
  handleCreateVoterRequest,
  handleVotersRequest,
  handleDeleteVoterRequest,
  watchStatus,
} from '../sagas';

describe('voterRegisteredChan', () => {
  const unsubscribe = jest.fn();
  const obs = {
    subscribe: jest.fn(() => ({ unsubscribe })),
  };
  const func = () => voterRegisteredChan(obs);

  beforeEach(() => {
    obs.subscribe.mockClear();
    unsubscribe.mockClear();
  });

  it('should subscribe next null', () => {
    func();
    expect(obs.subscribe.mock.calls.length).toEqual(1);
    const obj = obs.subscribe.mock.calls[0][0];
    obj.next();
  });

  it('should subscribe next not null', (done) => {
    const res = func();
    expect(obs.subscribe.mock.calls.length).toEqual(1);
    const obj = obs.subscribe.mock.calls[0][0];
    const st = { bId: 'b', status: 's' };
    res.take((action) => {
      expect(action).toEqual(st);
      done();
    });
    obj.next({ data: { voterRegistered: st } });
  });

  it('should return unsubscribe', () => {
    const res = func();
    res.close();
    expect(unsubscribe.mock.calls.length).toEqual(1);
  });
});

describe('handleVoterRgRequestAction', () => {
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleVoterRgRequestAction({ bId: '66' });
  const dArgs0 = [api.subscribe, gql.VoterRegistered, { bId: '66' }, 'cre'];
  const dArgs1 = [voterRegisteredChan, 123];

  it('should dispatch voterRegistered', () => {
    const chan = 'chan';
    const res = ['66', { iCode: '2' }];
    let id = 0;
    const fn = (par, next) => {
      id += 1;
      if (id > 2) return next();
      return { iCode: '2' };
    };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs0)
      .call(...dArgs1)
      .take(chan)
      .take(chan)
      .provide([
        [matchers.call(...dArgs0), 123],
        [matchers.call(...dArgs1), chan],
        [matchers.take(chan), dynamic(fn)],
      ])
      .put(editVotersContainerActions.voterRegistered(...res))
      .put(editVotersContainerActions.voterRegistered(...res))
      .silentRun();
  });
});

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

// Watcher
describe('watchStatus', () => {
  it('should take request dedup', () => {
    const req = (bId) => editVotersContainerActions.voterRgRequest({ bId });
    let id = 0;
    const fn = () => {
      id += 1;
      expect(id).toBeLessThanOrEqual(1);
      return {};
    };

    return expectSaga(watchStatus)
      .fork(handleVoterRgRequestAction, req('1'))
      .provide([
        [matchers.fork(handleVoterRgRequestAction, req('1')), dynamic(fn)],
      ])
      .dispatch(req('1'))
      .dispatch(req('1'))
      .silentRun();
  });
});
