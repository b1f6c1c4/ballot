import * as CREATE_BALLOT_CONTAINER from './constants';

// Actions
export function create() {
  return {
    type: CREATE_BALLOT_CONTAINER.CREATE_ACTION,
  };
}

// Sagas
export function createBallotRequest() {
  return {
    type: CREATE_BALLOT_CONTAINER.CREATE_BALLOT_REQUEST,
  };
}

export function createBallotSuccess(result) {
  return {
    type: CREATE_BALLOT_CONTAINER.CREATE_BALLOT_SUCCESS,
    result,
  };
}

export function createBallotFailure(error) {
  return {
    type: CREATE_BALLOT_CONTAINER.CREATE_BALLOT_FAILURE,
    error,
  };
}
