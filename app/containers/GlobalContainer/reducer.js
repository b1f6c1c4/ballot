import { fromJS } from 'immutable';

import * as GLOBAL_CONTAINER from './constants';

const initialState = fromJS({
  isLoading: false,
  isDrawerOpen: false,
  isAccountOpen: false,
  credential: null,
  listBallots: null,
  currentBallot: null,
});

function globalContainerReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    case GLOBAL_CONTAINER.OPEN_DRAWER_ACTION:
      return state.set('isDrawerOpen', true);
    case GLOBAL_CONTAINER.CLOSE_DRAWER_ACTION:
      return state.set('isDrawerOpen', false);
    case GLOBAL_CONTAINER.OPEN_ACCOUNT_ACTION:
      return state.set('isAccountOpen', true);
    case GLOBAL_CONTAINER.CLOSE_ACCOUNT_ACTION:
      return state.set('isAccountOpen', false);
    case GLOBAL_CONTAINER.LOGIN_ACTION:
      return state.set('credential', fromJS(action.credential));
    case GLOBAL_CONTAINER.LOGOUT_ACTION:
      return state.set('credential', null);
    // Sagas
    case GLOBAL_CONTAINER.BALLOTS_REQUEST:
      return state.set('isLoading', true);
    case GLOBAL_CONTAINER.BALLOTS_SUCCESS:
      return state.set('isLoading', false)
        .set('listBallots', fromJS(action.result.ballots));
    case GLOBAL_CONTAINER.BALLOTS_FAILURE:
      return state.set('isLoading', false);
    // Default
    default:
      return state;
  }
}

export default globalContainerReducer;
