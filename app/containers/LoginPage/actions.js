import * as LOGIN_PAGE from './constants';

// Actions
export function submitLogin() {
  return {
    type: LOGIN_PAGE.SUBMIT_LOGIN_ACTION,
  };
}

// Sagas
export function loginRequest() {
  return {
    type: LOGIN_PAGE.LOGIN_REQUEST,
  };
}

export function loginSuccess(result) {
  return {
    type: LOGIN_PAGE.LOGIN_SUCCESS,
    result,
  };
}

export function loginFailure(error) {
  return {
    type: LOGIN_PAGE.LOGIN_FAILURE,
    error,
  };
}
