import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import api from 'utils/request';

import * as STATUS_PAGE from '../constants';
import * as statusPageActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleCheckStatusRequest,
} from '../sagas';

// Sagas
describe('handleCheckStatusRequest Saga', () => {
  // eslint-disable-next-line arrow-body-style
  it('should listen CHECK_STATUS_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(STATUS_PAGE.CHECK_STATUS_REQUEST)
      .silentRun();
  });

  it('should dispatch the checkStatusSuccess', () => {
    const status = {
      version: 'the-v',
      commitHash: 'the-h',
    };
    const response = { data: { status } };

    return expectSaga(handleCheckStatusRequest)
      .call(api.query, { query: gql.Status })
      .provide([
        [matchers.call(api.query, { query: gql.Status }), response],
      ])
      .put(statusPageActions.checkStatusSuccess(status))
      .run();
  });

  it('should call the checkStatusFailure', () => {
    const error = new Error('value');

    return expectSaga(handleCheckStatusRequest)
      .call(api.query, { query: gql.Status })
      .provide([
        [matchers.call(api.query, { query: gql.Status }), throwError(error)],
      ])
      .put(statusPageActions.checkStatusFailure(error))
      .run();
  });
});

// Watcher
describe('watcher', () => {
  // eslint-disable-next-line arrow-body-style
  it('should forward fetchStatus to checkStatusRequest', () => {
    return expectSaga(watcher)
      .provide([
        [matchers.put(statusPageActions.checkStatusRequest())],
      ])
      .dispatch(statusPageActions.fetchStatus())
      .silentRun();
  });
});
