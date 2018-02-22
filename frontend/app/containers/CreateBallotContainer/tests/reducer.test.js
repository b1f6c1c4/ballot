import { fromJS } from 'immutable';

import * as createBallotContainerActions from '../actions';
import createBallotContainerReducer from '../reducer';

describe('createBallotContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(createBallotContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions

  // Sagas
  it('should handle createBallot request', () => {
    const originalState = state.set('isLoading', false);
    const param = { name: 'n' };
    const expectedResult = state.set('isLoading', true);

    expect(createBallotContainerReducer(originalState, createBallotContainerActions.createBallotRequest(param))).toEq(expectedResult);
  });

  it('should handle createBallot success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(createBallotContainerReducer(originalState, createBallotContainerActions.createBallotSuccess(result))).toEq(expectedResult);
  });

  it('should handle createBallot failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(createBallotContainerReducer(originalState, createBallotContainerActions.createBallotFailure(error))).toEq(expectedResult);
  });
});
