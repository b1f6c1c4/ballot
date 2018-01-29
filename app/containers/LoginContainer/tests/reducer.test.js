import { fromJS } from 'immutable';

import loginContainerReducer from '../reducer';

import * as loginContainerActions from '../actions';

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
    expect(loginContainerReducer(undefined, {})).toEqual(expectedResult);
  });

  // Actions
  it('should handle submitLogin action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(loginContainerReducer(originalState, loginContainerActions.submitLogin())).toEqual(expectedResult);
  });

  it('should handle submitRegister action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(loginContainerReducer(originalState, loginContainerActions.submitRegister())).toEqual(expectedResult);
  });

  it('should handle changeActiveId action', () => {
    const originalState = state;
    const expectedResult = state.set('activeId', 123);

    expect(loginContainerReducer(originalState, loginContainerActions.changeActiveId(123))).toEqual(expectedResult);
  });

  // Sagas
  it('should handle login request', () => {
    const originalState = state;
    const expectedResult = state.set('isLoading', true);

    expect(loginContainerReducer(originalState, loginContainerActions.loginRequest())).toEqual(expectedResult);
  });

  it('should handle login success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(loginContainerReducer(originalState, loginContainerActions.loginSuccess(result))).toEqual(expectedResult);
  });

  it('should handle login failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(loginContainerReducer(originalState, loginContainerActions.loginFailure(error))).toEqual(expectedResult);
  });

  it('should handle register request', () => {
    const originalState = state;
    const expectedResult = state.set('isLoading', true);

    expect(loginContainerReducer(originalState, loginContainerActions.registerRequest())).toEqual(expectedResult);
  });

  it('should handle register success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(loginContainerReducer(originalState, loginContainerActions.registerSuccess(result))).toEqual(expectedResult);
  });

  it('should handle register failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(loginContainerReducer(originalState, loginContainerActions.registerFailure(error))).toEqual(expectedResult);
  });
});
