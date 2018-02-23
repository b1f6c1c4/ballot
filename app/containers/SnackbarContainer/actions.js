import * as SNACKBAR_CONTAINER from './constants';

// Actions
export function snackbarRequest(message) {
  return {
    type: SNACKBAR_CONTAINER.SNACKBAR_REQUEST,
    message,
  };
}

export function snackbarShow(message) {
  return {
    type: SNACKBAR_CONTAINER.SNACKBAR_SHOW,
    message,
  };
}

export function snackbarHide() {
  return {
    type: SNACKBAR_CONTAINER.SNACKBAR_HIDE,
  };
}

// Sagas
