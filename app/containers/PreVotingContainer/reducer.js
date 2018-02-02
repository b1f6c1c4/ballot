import _ from 'lodash';
import { fromJS } from 'immutable';

import * as PRE_VOTING_CONTAINER from './constants';

const initialState = fromJS({
  isLoading: false,
  isSignLoading: false,
  ballot: null,
  error: null,
  ticket: null,
});

function preVotingContainerReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    case PRE_VOTING_CONTAINER.SIGN_ACTION:
      return state;
    // Sagas
    case PRE_VOTING_CONTAINER.REFRESH_REQUEST:
      return state.set('isLoading', true);
    case PRE_VOTING_CONTAINER.REFRESH_SUCCESS:
      return state.set('isLoading', false)
        .set('ballot', fromJS(action.result.ballot));
    case PRE_VOTING_CONTAINER.REFRESH_FAILURE:
      return state.set('isLoading', false)
        .set('ballot', null)
        .set('error', fromJS(_.toPlainObject(action.error)));
    case PRE_VOTING_CONTAINER.SIGN_REQUEST:
      return state.set('isSignLoading', true);
    case PRE_VOTING_CONTAINER.SIGN_SUCCESS:
      return state.set('isSignLoading', false)
        .set('ticket', action.ticket);
    case PRE_VOTING_CONTAINER.SIGN_FAILURE:
      return state.set('isSignLoading', false)
        .set('error', fromJS(_.toPlainObject(action.error)));
    // Default
    default:
      return state;
  }
}

export default preVotingContainerReducer;
