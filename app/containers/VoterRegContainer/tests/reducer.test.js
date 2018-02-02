import { fromJS } from 'immutable';

import voterRegContainerReducer from '../reducer';

import * as voterRegContainerActions from '../actions';

describe('voterRegContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(voterRegContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions

  // Sagas
  it('should handle register request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.registerRequest(param))).toEq(expectedResult);
  });

  it('should handle register success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.registerSuccess(result))).toEq(expectedResult);
  });

  it('should handle register failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.registerFailure(error))).toEq(expectedResult);
  });

  it('should handle refresh request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.refreshRequest(param))).toEq(expectedResult);
  });

  it('should handle refresh success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.refreshSuccess(result))).toEq(expectedResult);
  });

  it('should handle refresh failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.refreshFailure(error))).toEq(expectedResult);
  });
});
