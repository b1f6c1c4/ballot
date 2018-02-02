import { fromJS } from 'immutable';

import statusContainerReducer from '../reducer';

import * as statusContainerActions from '../actions';

describe('statusContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      status: {
        version: 'unknown',
        commitHash: 'unknown',
      },
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(statusContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions
  it('should handle fetchStatus action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(statusContainerReducer(originalState, statusContainerActions.fetchStatus())).toEq(expectedResult);
  });

  // Sagas
  it('should handle checkStatus request', () => {
    const originalState = state;
    const expectedResult = state;

    expect(statusContainerReducer(originalState, statusContainerActions.checkStatusRequest())).toEq(expectedResult);
  });

  it('should handle checkStatus success', () => {
    const originalState = state;
    const result = {
      version: 'the-v',
      commitHash: 'the-h',
    };
    const expectedResult = state.set('status', fromJS(result));

    expect(statusContainerReducer(originalState, statusContainerActions.checkStatusSuccess(result))).toEq(expectedResult);
  });

  it('should handle checkStatus failure', () => {
    const originalState = state;
    const error = { };
    const expectedResult = state;

    expect(statusContainerReducer(originalState, statusContainerActions.checkStatusFailure(error))).toEq(expectedResult);
  });
});
