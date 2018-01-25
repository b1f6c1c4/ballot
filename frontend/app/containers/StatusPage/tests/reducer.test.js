import { fromJS } from 'immutable';

import statusPageReducer from '../reducer';

import * as statusPageActions from '../actions';

describe('statusPageReducer', () => {
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
    expect(statusPageReducer(undefined, {})).toEqual(expectedResult);
  });

  // Actions
  it('should handle fetchStatus action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(statusPageReducer(originalState, statusPageActions.fetchStatus())).toEqual(expectedResult);
  });

  // Sagas
  it('should handle checkStatus request', () => {
    const originalState = state;
    const expectedResult = state;

    expect(statusPageReducer(originalState, statusPageActions.checkStatusRequest())).toEqual(expectedResult);
  });

  it('should handle checkStatus success', () => {
    const originalState = state;
    const result = {
      version: 'the-v',
      commitHash: 'the-h',
    };
    const expectedResult = state.set('status', fromJS(result));

    expect(statusPageReducer(originalState, statusPageActions.checkStatusSuccess(result))).toEqual(expectedResult);
  });

  it('should handle checkStatus failure', () => {
    const originalState = state;
    const error = { };
    const expectedResult = state;

    expect(statusPageReducer(originalState, statusPageActions.checkStatusFailure(error))).toEqual(expectedResult);
  });
});
