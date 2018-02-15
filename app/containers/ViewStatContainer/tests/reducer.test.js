import { fromJS } from 'immutable';

import viewStatContainerReducer from '../reducer';

import * as viewStatContainerActions from '../actions';

describe('viewStatContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(viewStatContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions
  it('should handle changeField action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.changeField())).toEq(expectedResult);
  });

  // Sagas
  it('should handle ballot request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.ballotRequest(param))).toEq(expectedResult);
  });

  it('should handle ballot success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.ballotSuccess(result))).toEq(expectedResult);
  });

  it('should handle ballot failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.ballotFailure(error))).toEq(expectedResult);
  });

  it('should handle stats request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.statsRequest(param))).toEq(expectedResult);
  });

  it('should handle stats success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.statsSuccess(result))).toEq(expectedResult);
  });

  it('should handle stats failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.statsFailure(error))).toEq(expectedResult);
  });
});
