import { fromJS } from 'immutable';

import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';
import * as voterRegContainerActions from '../actions';
import voterRegContainerReducer from '../reducer';

describe('voterRegContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
      isRegLoading: false,
      ballot: null,
      error: null,
      privateKey: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(voterRegContainerReducer(undefined, {})).toEq(expectedResult);
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

    expect(voterRegContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
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

    expect(voterRegContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
  });

  // Sagas
  it('should handle register request', () => {
    const originalState = state.set('isRegLoading', false).set('error', 'e');
    const param = { bId: 'val' };
    const expectedResult = state.set('isRegLoading', true).set('error', 'e');

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.registerRequest(param))).toEq(expectedResult);
  });

  it('should handle register success', () => {
    const originalState = state.set('isRegLoading', true);
    const result = { };
    const param = { privateKey: 'pk' };
    const expectedResult = state.set('isRegLoading', false)
      .set('privateKey', 'pk');

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.registerSuccess(result, param))).toEq(expectedResult);
  });

  it('should handle register failure', () => {
    const originalState = state.set('isRegLoading', true).set('error', 'e');
    const error = { key: 'value' };
    const expectedResult = state.set('isRegLoading', false).set('error', 'e');

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.registerFailure(error))).toEq(expectedResult);
  });

  it('should handle refresh request', () => {
    const originalState = state.set('isLoading', false).set('error', 'e');
    const param = { bId: 'val' };
    const expectedResult = state.set('isLoading', true);

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.refreshRequest(param))).toEq(expectedResult);
  });

  it('should handle refresh success', () => {
    const originalState = state.set('isLoading', true);
    const ballot = { name: 'nm', owner: 'ow', status: 'st' };
    const result = { ballot };
    const expectedResult = state.set('isLoading', false)
      .set('ballot', ballot);

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.refreshSuccess(result))).toEq(expectedResult);
  });

  it('should handle refresh failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(voterRegContainerReducer(originalState, voterRegContainerActions.refreshFailure(error))).toEq(expectedResult);
  });
});
