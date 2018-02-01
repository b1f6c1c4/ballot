import { fromJS } from 'immutable';

import editFieldsContainerReducer from '../reducer';

import * as editFieldsContainerActions from '../actions';

describe('editFieldsContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(editFieldsContainerReducer(undefined, {})).toEqual(expectedResult);
  });

  // Actions
  it('should handle add action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.add())).toEqual(expectedResult);
  });

  it('should handle remove action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.remove())).toEqual(expectedResult);
  });

  it('should handle reorder action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.reorder())).toEqual(expectedResult);
  });

  it('should handle startEdit action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.startEdit())).toEqual(expectedResult);
  });

  it('should handle cancelEdit action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.cancelEdit())).toEqual(expectedResult);
  });

  it('should handle saveEdit action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.saveEdit())).toEqual(expectedResult);
  });

  // Sagas
  it('should handle save request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.saveRequest(param))).toEqual(expectedResult);
  });

  it('should handle save success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.saveSuccess(result))).toEqual(expectedResult);
  });

  it('should handle save failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.saveFailure(error))).toEqual(expectedResult);
  });

  it('should handle refresh request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.refreshRequest(param))).toEqual(expectedResult);
  });

  it('should handle refresh success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.refreshSuccess(result))).toEqual(expectedResult);
  });

  it('should handle refresh failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(editFieldsContainerReducer(originalState, editFieldsContainerActions.refreshFailure(error))).toEqual(expectedResult);
  });
});
