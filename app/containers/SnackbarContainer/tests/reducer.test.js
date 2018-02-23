import { fromJS } from 'immutable';

import snackbarContainerReducer from '../reducer';

import * as snackbarContainerActions from '../actions';

describe('snackbarContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(snackbarContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions

  // Sagas
  it('should handle external request', () => {
    const originalState = state.set('isLoading', false);
    const param = { id: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(snackbarContainerReducer(originalState, snackbarContainerActions.externalRequest(param))).toEq(expectedResult);
  });

  it('should handle external success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(snackbarContainerReducer(originalState, snackbarContainerActions.externalSuccess(result))).toEq(expectedResult);
  });

  it('should handle external failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(snackbarContainerReducer(originalState, snackbarContainerActions.externalFailure(error))).toEq(expectedResult);
  });
});
