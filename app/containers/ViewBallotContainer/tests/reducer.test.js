import { fromJS } from 'immutable';

import viewBallotContainerReducer from '../reducer';

import * as viewBallotContainerActions from '../actions';

describe('viewBallotContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(viewBallotContainerReducer(undefined, {})).toEqual(expectedResult);
  });

  // Actions
  it('should handle refresh action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.refresh())).toEqual(expectedResult);
  });

  // Sagas
  it('should handle ballot request', () => {
    const originalState = state.set('isLoading', false);
    const expectedResult = state.set('isLoading', true);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotRequest())).toEqual(expectedResult);
  });

  it('should handle ballot success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotSuccess(result))).toEqual(expectedResult);
  });

  it('should handle ballot failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotFailure(error))).toEqual(expectedResult);
  });
});
