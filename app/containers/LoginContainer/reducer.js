import { fromJS } from 'immutable';

import * as LOGIN_CONTAINER from './constants';

const initialState = fromJS({
  data: 'the data',
});

function loginContainerReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    case LOGIN_CONTAINER.SUBMIT_LOGIN_ACTION:
      return state;
    case LOGIN_CONTAINER.SUBMIT_REGISTER_ACTION:
      return state;
    // Sagas
    case LOGIN_CONTAINER.LOGIN_REQUEST:
      return state;
    case LOGIN_CONTAINER.LOGIN_SUCCESS:
      return state;
    case LOGIN_CONTAINER.LOGIN_FAILURE:
      return state;
    case LOGIN_CONTAINER.REGISTER_REQUEST:
      return state;
    case LOGIN_CONTAINER.REGISTER_SUCCESS:
      return state;
    case LOGIN_CONTAINER.REGISTER_FAILURE:
      return state;
    // Default
    default:
      return state;
  }
}

export default loginContainerReducer;
