import * as STATUS_PAGE from './constants';

// Actions
export function fetchStatus() {
  return {
    type: STATUS_PAGE.FETCH_STATUS_ACTION,
  };
}

// Sagas
export function checkStatusRequest() {
  return {
    type: STATUS_PAGE.CHECK_STATUS_REQUEST,
  };
}

export function checkStatusSuccess(result) {
  return {
    type: STATUS_PAGE.CHECK_STATUS_SUCCESS,
    result,
  };
}

export function checkStatusFailure(error) {
  return {
    type: STATUS_PAGE.CHECK_STATUS_FAILURE,
    error,
  };
}
