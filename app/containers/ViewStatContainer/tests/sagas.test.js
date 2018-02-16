import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as VIEW_STAT_CONTAINER from '../constants';
import * as viewStatContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleBallotRequest,
  handleStatsRequest,
  handleExportRequest,
} from '../sagas';

// Sagas
describe('handleBallotRequest Saga', () => {
  const variables = { bId: 'val' };
  const func = () => handleBallotRequest(variables);
  const dArgs = [api.query, gql.Ballot, variables];

  // eslint-disable-next-line arrow-body-style
  it('should listen BALLOT_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_STAT_CONTAINER.BALLOT_REQUEST)
      .silentRun();
  });

  it('should dispatch ballotSuccess', () => {
    const ballot = 'resp';
    const response = { ballot };

    return expectSaga(func)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(viewStatContainerActions.ballotSuccess(response))
      .run();
  });

  it('should dispatch ballotSuccess and statsRequest', () => {
    const ballot = { fields: ['a', 'b'] };
    const response = { ballot };
    const vars = { bId: 'val', max: 2 };

    return expectSaga(func)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(viewStatContainerActions.ballotSuccess(response))
      .put(viewStatContainerActions.statsRequest(vars))
      .run();
  });

  it('should dispatch ballotFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(viewStatContainerActions.ballotFailure(error))
      .run();
  });
});

describe('handleStatsRequest Saga', () => {
  const variables = { bId: 'val', max: 2 };
  const func = () => handleStatsRequest(variables);
  const dArgs = (index) => [api.query, gql.FieldStat, { bId: 'val', index }];

  // eslint-disable-next-line arrow-body-style
  it('should listen STATS_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_STAT_CONTAINER.STATS_REQUEST)
      .silentRun();
  });

  it('should dispatch statsSuccess', () => {
    const fieldStats = 'resp';
    const response = { fieldStats };
    const responses = [response, response];

    return expectSaga(func)
      .call(...dArgs(0))
      .call(...dArgs(1))
      .provide([
        [matchers.call(...dArgs(0)), response],
        [matchers.call(...dArgs(1)), response],
      ])
      .put(viewStatContainerActions.statsSuccess(responses))
      .run();
  });

  it('should dispatch statsFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .provide([
        [matchers.call(...dArgs(0)), throwError(error)],
        [matchers.call(...dArgs(1)), throwError(error)],
      ])
      .put(viewStatContainerActions.statsFailure(error))
      .run();
  });
});

describe('handleExportRequest Saga', () => {
  const variables = { bId: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleExportRequest(variables);
  const dArgs = [api.query, gql.Export, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen EXPORT_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(VIEW_STAT_CONTAINER.EXPORT_REQUEST)
      .silentRun();
  });

  it('should dispatch exportSuccess', () => {
    const export = 'resp';
    const response = { export };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(viewStatContainerActions.exportSuccess(response))
      .run();
  });

  it('should dispatch exportFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(viewStatContainerActions.exportFailure(error))
      .run();
  });
});
