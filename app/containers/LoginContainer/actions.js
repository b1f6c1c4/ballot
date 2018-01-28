import * as LOGIN_CONTAINER from './constants';

// Actions
export function submitLogin() {
  return {
    type: LOGIN_CONTAINER.SUBMIT_LOGIN_ACTION,
  };
}

export function submitRegister() {
  return {
    type: LOGIN_CONTAINER.SUBMIT_REGISTER_ACTION,
  };
}

// Sagas
export function loginRequest() {
  return {
    type: LOGIN_CONTAINER.LOGIN_REQUEST,
  };
}

export function loginSuccess(result) {
  return {
    type: LOGIN_CONTAINER.LOGIN_SUCCESS,
    result,
  };
}

export function loginFailure(error) {
  return {
    type: LOGIN_CONTAINER.LOGIN_FAILURE,
    error,
  };
}

export function registerRequest() {
  return {
    type: LOGIN_CONTAINER.REGISTER_REQUEST,
  };
}

export function registerSuccess(result) {
  return {
    type: LOGIN_CONTAINER.REGISTER_SUCCESS,
    result,
  };
}

export function registerFailure(error) {
  return {
    type: LOGIN_CONTAINER.REGISTER_FAILURE,
    error,
  };
}
