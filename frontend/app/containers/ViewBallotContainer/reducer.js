import _ from 'lodash';
import { fromJS } from 'immutable';

import * as GLOBAL_CONTAINER from 'containers/GlobalContainer/constants';
import * as VIEW_BALLOT_CONTAINER from './constants';

const initialState = fromJS({
  isLoading: false,
  ballot: null,
  error: null,
  count: null,
});

function viewBallotContainerReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    case GLOBAL_CONTAINER.STATUS_CHANGE_ACTION:
      if (state.getIn(['ballot', 'bId']) === action.bId) {
        return state.setIn(['ballot', 'status'], action.status);
      }
      return state;
    // Sagas
    case VIEW_BALLOT_CONTAINER.BALLOT_REQUEST:
      return state.set('isLoading', true)
        .set('error', null);
    case VIEW_BALLOT_CONTAINER.BALLOT_SUCCESS:
      return state.set('isLoading', false)
        .set('ballot', fromJS(action.result.ballot));
    case VIEW_BALLOT_CONTAINER.BALLOT_FAILURE:
      return state.set('isLoading', false)
        .set('ballot', null)
        .set('error', fromJS(_.toPlainObject(action.error)));
    case VIEW_BALLOT_CONTAINER.FINALIZE_REQUEST:
      return state.set('isLoading', true);
    case VIEW_BALLOT_CONTAINER.FINALIZE_SUCCESS:
      return state.set('isLoading', false);
    case VIEW_BALLOT_CONTAINER.FINALIZE_FAILURE:
      return state.set('isLoading', false)
        .set('error', fromJS(_.toPlainObject(action.error)));
    case VIEW_BALLOT_CONTAINER.COUNT_REQUEST:
      return state.set('isLoading', true);
    case VIEW_BALLOT_CONTAINER.COUNT_SUCCESS:
      return state.set('isLoading', false)
        .set('count', action.result.countTickets);
    case VIEW_BALLOT_CONTAINER.COUNT_FAILURE:
      return state.set('isLoading', false)
        .set('count', null)
        .set('error', fromJS(_.toPlainObject(action.error)));
    // Default
    default:
      return state;
  }
}

export default viewBallotContainerReducer;