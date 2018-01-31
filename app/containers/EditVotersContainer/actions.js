import * as EDIT_VOTERS_CONTAINER from './constants';

// Actions

// Sagas
export function createVoterRequest() {
  return {
    type: EDIT_VOTERS_CONTAINER.CREATE_VOTER_REQUEST,
  };
}

export function createVoterSuccess(result) {
  return {
    type: EDIT_VOTERS_CONTAINER.CREATE_VOTER_SUCCESS,
    result,
  };
}

export function createVoterFailure(error) {
  return {
    type: EDIT_VOTERS_CONTAINER.CREATE_VOTER_FAILURE,
    error,
  };
}

export function deleteVoterRequest() {
  return {
    type: EDIT_VOTERS_CONTAINER.DELETE_VOTER_REQUEST,
  };
}

export function deleteVoterSuccess(result, param) {
  return {
    type: EDIT_VOTERS_CONTAINER.DELETE_VOTER_SUCCESS,
    result,
    ...param,
  };
}

export function deleteVoterFailure(error) {
  return {
    type: EDIT_VOTERS_CONTAINER.DELETE_VOTER_FAILURE,
    error,
  };
}

export function votersRequest() {
  return {
    type: EDIT_VOTERS_CONTAINER.VOTERS_REQUEST,
  };
}

export function votersSuccess(result) {
  return {
    type: EDIT_VOTERS_CONTAINER.VOTERS_SUCCESS,
    result,
  };
}

export function votersFailure(error) {
  return {
    type: EDIT_VOTERS_CONTAINER.VOTERS_FAILURE,
    error,
  };
}
