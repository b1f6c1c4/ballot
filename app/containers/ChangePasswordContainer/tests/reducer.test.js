import { fromJS } from 'immutable';

import changePasswordContainerReducer from '../reducer';

import * as changePasswordContainerActions from '../actions';

describe('changePasswordContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(changePasswordContainerReducer(undefined, {})).toEqual(expectedResult);
  });

  // Actions

  // Sagas
  it('should handle password request', () => {
    const originalState = state.set('isLoading', false);
    const param = { oldPassword: 'val', newPassword: 'val2' };
    const expectedResult = state.set('isLoading', true);

    expect(changePasswordContainerReducer(originalState, changePasswordContainerActions.passwordRequest(param))).toEqual(expectedResult);
  });

  it('should handle password success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(changePasswordContainerReducer(originalState, changePasswordContainerActions.passwordSuccess(result))).toEqual(expectedResult);
  });

  it('should handle password failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(changePasswordContainerReducer(originalState, changePasswordContainerActions.passwordFailure(error))).toEqual(expectedResult);
  });
});
