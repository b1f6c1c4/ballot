import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as api from 'utils/request';
import { initialize } from 'redux-form';

import * as SUBSCRIPTION_CONTAINER from 'containers/SubscriptionContainer/constants';
import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';
import * as EDIT_FIELDS_CONTAINER from '../constants';
import * as editFieldsContainerActions from '../actions';
import gql from '../api.graphql';

import watcher, {
  updateDialogEdit,
  updateDialogCreate,
  handleSaveRequest,
  handleRefreshRequest,
  handleStatusRequest,
} from '../sagas';

describe('updateDialogCreate Saga', () => {
  const func = updateDialogCreate;

  it('should dispatch initialize', () => {
    const values = { };

    return expectSaga(func)
      .put(initialize('editFieldForm', values, {
        updateUnregisteredFields: true,
      }))
      .run();
  });

  // eslint-disable-next-line arrow-body-style
  it('should listen START_CREATE_ACTION in the watcher', () => {
    return expectSaga(watcher)
      .take(EDIT_FIELDS_CONTAINER.START_CREATE_ACTION)
      .silentRun();
  });
});

describe('updateDialogEdit Saga', () => {
  const state = fromJS({
    editFieldsContainer: {
      fields: [{
        type: 'StringField',
        key: 'k1',
        prompt: 'p1',
        stringDefault: 'def',
      }, {
        type: 'EnumField',
        key: 'k2',
        prompt: 'p2',
        enumItems: ['def', 'def2'],
      }, {
        type: 'unknown',
        key: 'k3',
        prompt: 'p3',
        unknown: 'evil',
      }],
    },
  });
  const func = updateDialogEdit;

  // eslint-disable-next-line arrow-body-style
  it('should listen START_EDIT_ACTION in the watcher', () => {
    return expectSaga(watcher)
      .take(EDIT_FIELDS_CONTAINER.START_EDIT_ACTION)
      .silentRun();
  });

  it('should handle string field', () => {
    const values = {
      type: 'StringField',
      prompt: 'p1',
      stringDefault: 'def',
    };

    return expectSaga(func, { index: 0 })
      .withState(state)
      .put(initialize('editFieldForm', values, {
        updateUnregisteredFields: true,
      }))
      .run();
  });

  it('should handle enum field', () => {
    const values = {
      type: 'EnumField',
      prompt: 'p2',
      enumItems: 'def\ndef2',
    };

    return expectSaga(func, { index: 1 })
      .withState(state)
      .put(initialize('editFieldForm', values, {
        updateUnregisteredFields: true,
      }))
      .run();
  });

  it('should handle unknown field', () => {
    const values = {
      type: 'unknown',
      prompt: 'p3',
    };

    return expectSaga(func, { index: 2 })
      .withState(state)
      .put(initialize('editFieldForm', values, {
        updateUnregisteredFields: true,
      }))
      .run();
  });
});

// Sagas
describe('handleSaveRequest Saga', () => {
  const variables = { bId: 'val' };
  const state = fromJS({
    globalContainer: { credential: { token: 'cre' } },
    editFieldsContainer: {
      fields: [{
        type: 'StringField',
        key: 'k1',
        prompt: 'p1',
        stringDefault: 'def',
      }, {
        type: 'EnumField',
        key: 'k2',
        prompt: 'p2',
        enumItems: ['def'],
      }, {
        type: 'unknown',
        key: 'k3',
        prompt: 'p3',
        unknown: 'evil',
      }],
    },
  });
  const func = () => handleSaveRequest(variables);
  const vars = {
    ...variables,
    fields: [
      { prompt: 'p1', stringDefault: 'def' },
      { prompt: 'p2', enumItems: ['def'] },
      { prompt: 'p3', unknown: 'evil' },
    ],
  };
  const dArgs = [api.mutate, gql.Save, vars, 'cre'];

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

// Subscriptions
describe('handleStatusRequest', () => {
  const state = fromJS({
    editFieldsContainer: {
      ballot: { bId: 'b', owner: 'o' },
    },
  });
  const func = handleStatusRequest;

  // eslint-disable-next-line arrow-body-style
  it('should listen STATUS_REQUEST_ACTION in the watcher', () => {
    return expectSaga(watcher)
      .take(EDIT_FIELDS_CONTAINER.STATUS_REQUEST_ACTION)
      .silentRun();
  });

  // eslint-disable-next-line arrow-body-style
  it('should not dispatch if no ballot', () => {
    return expectSaga(func)
      .withState(state.setIn(['editFieldsContainer', 'ballot'], undefined))
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
