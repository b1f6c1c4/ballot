import { fromJS } from 'immutable';

import viewBallotContainerReducer from '../reducer';

import * as viewBallotContainerActions from '../actions';

describe('viewBallotContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
      ballot: null,
      error: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(viewBallotContainerReducer(undefined, {})).toEqual(expectedResult);
  });

  // Actions

  // Sagas
  it('should handle ballot request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: '1' };
    const expectedResult = state.set('isLoading', true);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotRequest(param))).toEqual(expectedResult);
  });

  it('should handle ballot success', () => {
    const originalState = state.set('isLoading', true);
    const result = { ballot: 'aa' };
    const expectedResult = state.set('isLoading', false)
      .set('ballot', 'aa');

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotSuccess(result))).toEqual(expectedResult);
  });

  it('should handle ballot failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotFailure(error))).toEqual(expectedResult);
  });
});
