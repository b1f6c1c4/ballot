import { fromJS } from 'immutable';

import * as VIEW_BALLOT_CONTAINER from './constants';

const initialState = fromJS({
  isLoading: false,
  ballot: null,
});

function viewBallotContainerReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    // Sagas
    case VIEW_BALLOT_CONTAINER.BALLOT_REQUEST:
      return state.set('isLoading', true);
    case VIEW_BALLOT_CONTAINER.BALLOT_SUCCESS:
      return state.set('isLoading', false)
        .set('ballot', fromJS(action.result.ballot));
    case VIEW_BALLOT_CONTAINER.BALLOT_FAILURE:
      return state.set('isLoading', false);
    // Default
    default:
      return state;
  }
}

export default viewBallotContainerReducer;
