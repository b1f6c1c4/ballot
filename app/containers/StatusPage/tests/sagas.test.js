import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as STATUS_PAGE from '../constants';
import * as statusPageActions from '../actions';

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

  it('should dispatch the checkStatusSuccess action if it requests the credential successfully', () => {
    const response = {
      version: 'the-v',
      commitHash: 'the-h',
    };

    return expectSaga(handleCheckStatusRequest, api)
      .call(api.GET, '/', undefined)
      .provide([
        [matchers.call(api.GET, '/', undefined), response],
      ])
      .put(statusPageActions.checkStatusSuccess(response))
      .run();
  });

  it('should call the checkStatusFailure action if the response errors', () => {
    const error = new Error('value');

    return expectSaga(handleCheckStatusRequest, api)
      .call(api.GET, '/', undefined)
      .provide([
        [matchers.call(api.GET, '/', undefined), throwError(error)],
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
