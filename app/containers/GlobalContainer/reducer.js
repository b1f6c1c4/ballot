import { fromJS } from 'immutable';

import * as GLOBAL_CONTAINER from './constants';

const initialState = fromJS({
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
      return state;
    case GLOBAL_CONTAINER.LOGOUT_ACTION:
      return state;
    // Default
    default:
      return state;
  }
}

export default globalContainerReducer;
