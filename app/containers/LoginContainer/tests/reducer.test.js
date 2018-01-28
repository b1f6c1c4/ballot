import { fromJS } from 'immutable';

import loginContainerReducer from '../reducer';

import * as loginContainerActions from '../actions';

describe('loginContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      data: 'the data',
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

  // Sagas
  it('should handle login request', () => {
    const originalState = state;
    const expectedResult = state;

    expect(loginContainerReducer(originalState, loginContainerActions.loginRequest())).toEqual(expectedResult);
  });

  it('should handle login success', () => {
    const originalState = state;
    const result = { };
    const expectedResult = state;

    expect(loginContainerReducer(originalState, loginContainerActions.loginSuccess(result))).toEqual(expectedResult);
  });

  it('should handle login failure', () => {
    const originalState = state;
    const error = { };
    const expectedResult = state;

    expect(loginContainerReducer(originalState, loginContainerActions.loginFailure(error))).toEqual(expectedResult);
  });

  it('should handle register request', () => {
    const originalState = state;
    const expectedResult = state;

    expect(loginContainerReducer(originalState, loginContainerActions.registerRequest())).toEqual(expectedResult);
  });

  it('should handle register success', () => {
    const originalState = state;
    const result = { };
    const expectedResult = state;

    expect(loginContainerReducer(originalState, loginContainerActions.registerSuccess(result))).toEqual(expectedResult);
  });

  it('should handle register failure', () => {
    const originalState = state;
    const error = { };
    const expectedResult = state;

    expect(loginContainerReducer(originalState, loginContainerActions.registerFailure(error))).toEqual(expectedResult);
  });
});
