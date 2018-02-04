import * as VIEW_BALLOT_CONTAINER from './constants';

// Actions

// Sagas
export function ballotRequest({ bId }) {
  return {
    type: VIEW_BALLOT_CONTAINER.BALLOT_REQUEST,
    bId,
  };
}

export function ballotSuccess(result) {
  return {
    type: VIEW_BALLOT_CONTAINER.BALLOT_SUCCESS,
    result,
  };
}

export function ballotFailure(error) {
  return {
    type: VIEW_BALLOT_CONTAINER.BALLOT_FAILURE,
    error,
  };
}

export function finalizeRequest({ bId }) {
  return {
    type: VIEW_BALLOT_CONTAINER.FINALIZE_REQUEST,
    bId,
  };
}

export function finalizeSuccess(result) {
  return {
    type: VIEW_BALLOT_CONTAINER.FINALIZE_SUCCESS,
    result,
  };
}

export function finalizeFailure(error) {
  return {
    type: VIEW_BALLOT_CONTAINER.FINALIZE_FAILURE,
    error,
  };
}
