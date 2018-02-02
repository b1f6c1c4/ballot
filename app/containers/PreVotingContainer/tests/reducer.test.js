import { fromJS } from 'immutable';

import preVotingContainerReducer from '../reducer';

import * as preVotingContainerActions from '../actions';

describe('preVotingContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(preVotingContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions
  it('should handle sign action', () => {
    const originalState = state;
    const expectedResult = state;

    expect(preVotingContainerReducer(originalState, preVotingContainerActions.sign())).toEq(expectedResult);
  });

  // Sagas
  it('should handle refresh request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(preVotingContainerReducer(originalState, preVotingContainerActions.refreshRequest(param))).toEq(expectedResult);
  });

  it('should handle refresh success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(preVotingContainerReducer(originalState, preVotingContainerActions.refreshSuccess(result))).toEq(expectedResult);
  });

  it('should handle refresh failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(preVotingContainerReducer(originalState, preVotingContainerActions.refreshFailure(error))).toEq(expectedResult);
  });

  it('should handle sign request', () => {
    const originalState = state.set('isLoading', false);
    const param = { payload: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(preVotingContainerReducer(originalState, preVotingContainerActions.signRequest(param))).toEq(expectedResult);
  });

  it('should handle sign success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(preVotingContainerReducer(originalState, preVotingContainerActions.signSuccess(result))).toEq(expectedResult);
  });

  it('should handle sign failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(preVotingContainerReducer(originalState, preVotingContainerActions.signFailure(error))).toEq(expectedResult);
  });
});
