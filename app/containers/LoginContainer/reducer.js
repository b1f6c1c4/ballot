import { fromJS } from 'immutable';

import * as LOGIN_PAGE from './constants';

const initialState = fromJS({
  isLoading: false,
});

function loginContainerReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    case LOGIN_PAGE.SUBMIT_LOGIN_ACTION:
      return state;
    // Sagas
    case LOGIN_PAGE.LOGIN_REQUEST:
      return state.set('isLoading', true);
    case LOGIN_PAGE.LOGIN_SUCCESS:
      return state.set('isLoading', false);
    case LOGIN_PAGE.LOGIN_FAILURE:
      return state.set('isLoading', false);
    // Default
    default:
      return state;
  }
}

export default loginContainerReducer;
