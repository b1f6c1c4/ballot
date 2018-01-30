import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { push } from 'react-router-redux';

import * as globalContainerActions from '../actions';

import watcher, {
} from '../sagas';

// Sagas

// Watcher
describe('watcher', () => {
  // eslint-disable-next-line arrow-body-style
  it('should forward logout to push /app/login', () => {
    return expectSaga(watcher)
      .provide([
        [matchers.put(push('/app/login'))],
      ])
      .dispatch(globalContainerActions.logout())
      .silentRun();
  });
});
