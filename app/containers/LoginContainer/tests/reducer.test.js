import { fromJS } from 'immutable';

import loginContainerReducer from '../reducer';

import * as loginContainerActions from '../actions';

describe('loginContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
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
});
