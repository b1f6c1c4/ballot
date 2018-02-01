import * as EDIT_FIELDS_CONTAINER from './constants';

// Actions
export function add() {
  return {
    type: EDIT_FIELDS_CONTAINER.ADD_ACTION,
  };
}

export function remove({ index }) {
  return {
    type: EDIT_FIELDS_CONTAINER.REMOVE_ACTION,
    index,
  };
}

export function reorder() {
  return {
    type: EDIT_FIELDS_CONTAINER.REORDER_ACTION,
  };
}

export function startEdit() {
  return {
    type: EDIT_FIELDS_CONTAINER.START_EDIT_ACTION,
  };
}

export function cancelEdit() {
  return {
    type: EDIT_FIELDS_CONTAINER.CANCEL_EDIT_ACTION,
  };
}

export function saveEdit() {
  return {
    type: EDIT_FIELDS_CONTAINER.SAVE_EDIT_ACTION,
  };
}

// Sagas
export function saveRequest({ bId }) {
  return {
    type: EDIT_FIELDS_CONTAINER.SAVE_REQUEST,
    bId,
  };
}

export function saveSuccess(result) {
  return {
    type: EDIT_FIELDS_CONTAINER.SAVE_SUCCESS,
    result,
  };
}

export function saveFailure(error) {
  return {
    type: EDIT_FIELDS_CONTAINER.SAVE_FAILURE,
    error,
  };
}

export function refreshRequest({ bId }) {
  return {
    type: EDIT_FIELDS_CONTAINER.REFRESH_REQUEST,
    bId,
  };
}

export function refreshSuccess(result) {
  return {
    type: EDIT_FIELDS_CONTAINER.REFRESH_SUCCESS,
    result,
  };
}

export function refreshFailure(error) {
  return {
    type: EDIT_FIELDS_CONTAINER.REFRESH_FAILURE,
    error,
  };
}
