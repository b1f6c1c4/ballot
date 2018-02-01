import _ from 'lodash';
import { fromJS } from 'immutable';

import * as EDIT_FIELDS_CONTAINER from './constants';

const initialState = fromJS({
  isLoading: false,
  ballot: null,
  fields: null,
  error: null,
  currentId: null,
});

const normalizeFields = (fs) => fs.map((f) => {
  // eslint-disable-next-line no-underscore-dangle
  const type = f.__typename;
  const { prompt } = f;
  switch (type) {
    case 'StringField':
      return {
        type,
        prompt,
        stringDefault: f.default,
      };
    case 'EnumField':
      return {
        type,
        prompt,
        enumItems: f.items,
      };
    default: {
      const e = new Error('Type not supported');
      e.codes = ['tpns'];
      throw e;
    }
  }
});

function editFieldsContainerReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    case EDIT_FIELDS_CONTAINER.ADD_ACTION:
      return state;
    case EDIT_FIELDS_CONTAINER.REMOVE_ACTION:
      return state.set('fields', state.get('fields').delete(action.index));
    case EDIT_FIELDS_CONTAINER.REORDER_ACTION:
      return state;
    case EDIT_FIELDS_CONTAINER.START_EDIT_ACTION:
      return state;
    case EDIT_FIELDS_CONTAINER.CANCEL_EDIT_ACTION:
      return state;
    case EDIT_FIELDS_CONTAINER.SAVE_EDIT_ACTION:
      return state;
    // Sagas
    case EDIT_FIELDS_CONTAINER.SAVE_REQUEST:
      return state.set('isLoading', true)
        .set('error', null);
    case EDIT_FIELDS_CONTAINER.SAVE_SUCCESS: {
      try {
        const fields = normalizeFields(action.result.replaceFields);
        return state.set('isLoading', false)
          .set('fields', fromJS(fields));
      } catch (e) {
        return state.set('isLoading', false)
          .set('error', fromJS(_.toPlainObject(e)));
      }
    }
    case EDIT_FIELDS_CONTAINER.SAVE_FAILURE:
      return state.set('isLoading', false)
        .set('error', fromJS(_.toPlainObject(action.error)));
    case EDIT_FIELDS_CONTAINER.REFRESH_REQUEST:
      return state.set('isLoading', true)
        .set('error', null);
    case EDIT_FIELDS_CONTAINER.REFRESH_SUCCESS: {
      try {
        const fields = normalizeFields(action.result.ballot.fields);
        return state.set('isLoading', false)
          .delete('ballot')
          .setIn(['ballot', 'name'], action.result.ballot.name)
          .setIn(['ballot', 'status'], action.result.ballot.status)
          .set('fields', fromJS(fields));
      } catch (e) {
        return state.set('isLoading', false)
          .set('error', fromJS(_.toPlainObject(e)));
      }
    }
    case EDIT_FIELDS_CONTAINER.REFRESH_FAILURE:
      return state.set('isLoading', false)
        .set('error', fromJS(_.toPlainObject(action.error)));
    // Default
    default:
      return state;
  }
}

export default editFieldsContainerReducer;
