import { fromJS } from 'immutable';

import createBallotContainerReducer from '../reducer';

import * as createBallotContainerActions from '../actions';

describe('createBallotContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(createBallotContainerReducer(undefined, {})).toEqual(expectedResult);
  });

  // Actions

  // Sagas
  it('should handle createBallot request', () => {
    const originalState = state.set('isLoading', false);
    const param = { name: 'n' };
    const expectedResult = state.set('isLoading', true);

    expect(createBallotContainerReducer(originalState, createBallotContainerActions.createBallotRequest(param))).toEqual(expectedResult);
  });

  it('should handle createBallot success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(createBallotContainerReducer(originalState, createBallotContainerActions.createBallotSuccess(result))).toEqual(expectedResult);
  });

  it('should handle createBallot failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(createBallotContainerReducer(originalState, createBallotContainerActions.createBallotFailure(error))).toEqual(expectedResult);
  });
});
