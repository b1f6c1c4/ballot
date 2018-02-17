import * as EDIT_VOTERS_CONTAINER from './constants';

// Actions
export function voterRgRequest({ bId }) {
  return {
    type: EDIT_VOTERS_CONTAINER.VOTER_RG_REQUEST_ACTION,
    bId,
  };
}

export function voterRgStop() {
  return {
    type: EDIT_VOTERS_CONTAINER.VOTER_RG_STOP_ACTION,
  };
}

export function voterRegistered(bId, voter) {
  return {
    type: EDIT_VOTERS_CONTAINER.VOTER_REGISTERED_ACTION,
    bId,
    voter,
  };
}

// Sagas
export function createVoterRequest({ bId, name }) {
  return {
    type: EDIT_VOTERS_CONTAINER.CREATE_VOTER_REQUEST,
    bId,
    name,
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

export function deleteVoterRequest({ bId, iCode }) {
  return {
    type: EDIT_VOTERS_CONTAINER.DELETE_VOTER_REQUEST,
    bId,
    iCode,
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

export function votersRequest({ bId }) {
  return {
    type: EDIT_VOTERS_CONTAINER.VOTERS_REQUEST,
    bId,
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
