import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';

import * as EDIT_FIELDS_CONTAINER from '../constants';
import * as editFieldsContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  handleSaveRequest,
  handleRefreshRequest,
} from '../sagas';

// Sagas
describe('handleSaveRequest Saga', () => {
  const variables = { bId: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleSaveRequest(variables);
  const dArgs = [api.query, gql.Save, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen SAVE_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(EDIT_FIELDS_CONTAINER.SAVE_REQUEST)
      .silentRun();
  });

  it('should dispatch saveSuccess', () => {
    const save = 'resp';
    const response = { save };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(editFieldsContainerActions.saveSuccess(response))
      .run();
  });

  it('should dispatch saveFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(editFieldsContainerActions.saveFailure(error))
      .run();
  });
});

describe('handleRefreshRequest Saga', () => {
  const variables = { bId: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
  });
  const func = () => handleRefreshRequest(variables);
  const dArgs = [api.query, gql.Refresh, variables, 'cre'];

  // eslint-disable-next-line arrow-body-style
  it('should listen REFRESH_REQUEST in the watcher', () => {
    return expectSaga(watcher)
      .take(EDIT_FIELDS_CONTAINER.REFRESH_REQUEST)
      .silentRun();
  });

  it('should dispatch refreshSuccess', () => {
    const refresh = 'resp';
    const response = { refresh };

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), response],
      ])
      .put(editFieldsContainerActions.refreshSuccess(response))
      .run();
  });

  it('should dispatch refreshFailure', () => {
    const error = new Error('value');

    return expectSaga(func)
      .withState(state)
      .call(...dArgs)
      .provide([
        [matchers.call(...dArgs), throwError(error)],
      ])
      .put(editFieldsContainerActions.refreshFailure(error))
      .run();
  });
});
