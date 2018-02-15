import _ from 'lodash';
import { fromJS } from 'immutable';

import * as GLOBAL_CONTAINER from 'containers/GlobalContainer/constants';
import * as EDIT_VOTERS_CONTAINER from './constants';

const initialState = fromJS({
  isLoading: false,
  isCreateLoading: false,
  ballot: null,
  voters: null,
  error: null,
});

function editVotersContainerReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    case GLOBAL_CONTAINER.STATUS_CHANGE_ACTION:
      if (state.getIn(['ballot', 'bId']) === action.bId) {
        return state.setIn(['ballot', 'status'], action.status);
      }
      return state;
    // Sagas
    case EDIT_VOTERS_CONTAINER.CREATE_VOTER_REQUEST:
      return state
        .set('isCreateLoading', true)
        .set('error', null);
    case EDIT_VOTERS_CONTAINER.CREATE_VOTER_SUCCESS:
      return state
        .set('isCreateLoading', false)
        .set('voters', state.get('voters').push(fromJS(action.result.createVoter)));
    case EDIT_VOTERS_CONTAINER.CREATE_VOTER_FAILURE:
      return state
        .set('isCreateLoading', false)
        .set('error', fromJS(_.toPlainObject(action.error)));
    case EDIT_VOTERS_CONTAINER.DELETE_VOTER_REQUEST:
      return state
        .set('isLoading', true)
        .set('error', null);
    case EDIT_VOTERS_CONTAINER.DELETE_VOTER_SUCCESS:
      return state
        .set('isLoading', false)
        .set('voters', state.get('voters').filter((v) => v.get('iCode') !== action.iCode));
    case EDIT_VOTERS_CONTAINER.DELETE_VOTER_FAILURE:
      return state
        .set('isLoading', false)
        .set('error', fromJS(_.toPlainObject(action.error)));
    case EDIT_VOTERS_CONTAINER.VOTERS_REQUEST:
      return state
        .set('isLoading', true)
        .set('error', null);
    case EDIT_VOTERS_CONTAINER.VOTERS_SUCCESS:
      return state
        .set('isLoading', false)
        .set('ballot', fromJS(_.omit(action.result.ballot, 'voters')))
        .set('voters', fromJS(action.result.ballot.voters));
    case EDIT_VOTERS_CONTAINER.VOTERS_FAILURE:
      return state
        .set('isLoading', false)
        .set('error', fromJS(_.toPlainObject(action.error)));
    // Default
    default:
      return state;
  }
}

export default editVotersContainerReducer;
