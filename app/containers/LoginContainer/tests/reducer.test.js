import { fromJS } from 'immutable';

import * as loginContainerActions from '../actions';
import loginContainerReducer from '../reducer';

describe('loginContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      activeId: 0,
      isLoading: false,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(loginContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions
  it('should handle changeActiveId action', () => {
    const originalState = state;
    const expectedResult = state.set('activeId', 123);

    expect(loginContainerReducer(originalState, loginContainerActions.changeActiveId(123))).toEq(expectedResult);
  });

  // Sagas
  it('should handle login request', () => {
    const originalState = state;
    const param = { username: 'u', password: 'p' };
    const expectedResult = state.set('isLoading', true);

    expect(loginContainerReducer(originalState, loginContainerActions.loginRequest(param))).toEq(expectedResult);
  });

  it('should handle login success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(loginContainerReducer(originalState, loginContainerActions.loginSuccess(result))).toEq(expectedResult);
  });

  it('should handle login failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(loginContainerReducer(originalState, loginContainerActions.loginFailure(error))).toEq(expectedResult);
  });

  it('should handle register request', () => {
    const originalState = state;
    const param = { username: 'u', password: 'p' };
    const expectedResult = state.set('isLoading', true);

    expect(loginContainerReducer(originalState, loginContainerActions.registerRequest(param))).toEq(expectedResult);
  });

  it('should handle register success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(loginContainerReducer(originalState, loginContainerActions.registerSuccess(result))).toEq(expectedResult);
  });

  it('should handle register failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(loginContainerReducer(originalState, loginContainerActions.registerFailure(error))).toEq(expectedResult);
  });
});
