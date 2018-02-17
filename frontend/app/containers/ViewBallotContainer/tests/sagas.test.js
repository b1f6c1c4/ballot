import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError, dynamic } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import downloadCsv from 'download-csv';

import * as VIEW_BALLOT_CONTAINER from '../constants';
import * as viewBallotContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  voterRegisteredChan,
  handleVoterRgRequestAction,
  handleBallotRequest,
  handleFinalizeRequest,
  handleExportRequest,
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
    const res = { bId: '66', iCode: '2' };
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
      .put(viewBallotContainerActions.voterRegistered(res))
      .put(viewBallotContainerActions.voterRegistered(res))
      .silentRun();
  });
});

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

// Watcher
describe('watchStatus', () => {
  it('should take request dedup', () => {
    const req = (bId) => viewBallotContainerActions.voterRgRequest({ bId });
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
