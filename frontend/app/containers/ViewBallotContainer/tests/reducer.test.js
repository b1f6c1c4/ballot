import { fromJS } from 'immutable';
import * as globalContainerActions from 'containers/GlobalContainer/actions';

import viewBallotContainerReducer from '../reducer';

import * as viewBallotContainerActions from '../actions';

describe('viewBallotContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
      ballot: null,
      error: null,
      count: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(viewBallotContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions
  it('should handle valid global status change action', () => {
    const originalState = state.set('ballot', fromJS({
      bId: 'b',
      status: 's',
      evil: true,
    }));
    const param = { bId: 'b', status: 'x' };
    const expectedResult = state.set('ballot', fromJS({
      bId: 'b',
      status: 'x',
      evil: true,
    }));

    expect(viewBallotContainerReducer(originalState, globalContainerActions.statusChange(param))).toEq(expectedResult);
  });

  it('should handle invalid global status change action', () => {
    const originalState = state.set('ballot', fromJS({
      bId: 'b',
      status: 's',
      evil: true,
    }));
    const param = { bId: 'x', status: 'x' };
    const expectedResult = state.set('ballot', fromJS({
      bId: 'b',
      status: 's',
      evil: true,
    }));

    expect(viewBallotContainerReducer(originalState, globalContainerActions.statusChange(param))).toEq(expectedResult);
  });

  // Sagas
  it('should handle ballot request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: '1' };
    const expectedResult = state.set('isLoading', true);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotRequest(param))).toEq(expectedResult);
  });

  it('should handle ballot success', () => {
    const originalState = state.set('isLoading', true);
    const result = { ballot: 'aa', countTickets: 213 };
    const expectedResult = state.set('isLoading', false)
      .set('ballot', 'aa')
      .set('count', 213);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotSuccess(result))).toEq(expectedResult);
  });

  it('should handle ballot failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.ballotFailure(error))).toEq(expectedResult);
  });

  it('should handle finalize request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.finalizeRequest(param))).toEq(expectedResult);
  });

  it('should handle finalize success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', false);

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.finalizeSuccess(result))).toEq(expectedResult);
  });

  it('should handle finalize failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(viewBallotContainerReducer(originalState, viewBallotContainerActions.finalizeFailure(error))).toEq(expectedResult);
  });
});
