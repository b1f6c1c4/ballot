import { fromJS } from 'immutable';
import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';

import viewStatContainerReducer from '../reducer';

import * as viewStatContainerActions from '../actions';

describe('viewStatContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
      isStatsLoading: false,
      ballot: null,
      error: null,
      stats: null,
      fieldIndex: 0,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(viewStatContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions
  it('should handle valid subscription status change action', () => {
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

    expect(viewStatContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
  });

  it('should handle invalid subscription status change action', () => {
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

    expect(viewStatContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
  });

  it('should handle changeField action', () => {
    const originalState = state;
    const expectedResult = state.set('fieldIndex', 123);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.changeField(123))).toEq(expectedResult);
  });

  // Sagas
  it('should handle ballot request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.ballotRequest(param))).toEq(expectedResult);
  });

  it('should handle ballot success', () => {
    const originalState = state.set('isLoading', true);
    const result = { ballot: 'aa' };
    const expectedResult = state.set('isLoading', false)
      .set('ballot', 'aa');

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.ballotSuccess(result))).toEq(expectedResult);
  });

  it('should handle ballot failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.ballotFailure(error))).toEq(expectedResult);
  });

  it('should handle stats request', () => {
    const originalState = state.set('isStatsLoading', false);
    const param = { bId: 'val', max: 2 };
    const expectedResult = state.set('isStatsLoading', true);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.statsRequest(param))).toEq(expectedResult);
  });

  it('should handle stats success', () => {
    const originalState = state.set('isStatsLoading', true);
    const results = [
      { fieldStat: 'a' },
      { fieldStat: 'b' },
      { fieldStat: 'c' },
    ];
    const expectedResult = state.set('isStatsLoading', false)
      .set('stats', fromJS(['a', 'b', 'c']));

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.statsSuccess(results))).toEq(expectedResult);
  });

  it('should handle stats failure', () => {
    const originalState = state.set('isStatsLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isStatsLoading', false)
      .set('error', fromJS(error));

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.statsFailure(error))).toEq(expectedResult);
  });

  it('should handle export request', () => {
    const originalState = state.set('isLoading', false);
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', false);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.exportRequest(param))).toEq(expectedResult);
  });

  it('should handle export success', () => {
    const originalState = state.set('isLoading', true);
    const result = { };
    const expectedResult = state.set('isLoading', true);

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.exportSuccess(result))).toEq(expectedResult);
  });

  it('should handle export failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', true)
      .set('error', fromJS(error));

    expect(viewStatContainerReducer(originalState, viewStatContainerActions.exportFailure(error))).toEq(expectedResult);
  });
});
