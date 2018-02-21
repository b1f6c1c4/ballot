import { fromJS } from 'immutable';
import * as subscriptionContainerActions from 'containers/SubscriptionContainer/actions';

import globalContainerReducer from '../reducer';

import * as globalContainerActions from '../actions';

describe('globalContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isLoading: false,
      isDrawerOpen: false,
      isAccountOpen: false,
      credential: null,
      listBallots: null,
      error: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(globalContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions
  it('should handle openDrawer action', () => {
    const originalState = state.set('isDrawerOpen', false);
    const expectedResult = state.set('isDrawerOpen', true);

    expect(globalContainerReducer(originalState, globalContainerActions.openDrawer())).toEq(expectedResult);
  });

  it('should handle closeDrawer action', () => {
    const originalState = state.set('isDrawerOpen', true);
    const expectedResult = state.set('isDrawerOpen', false);

    expect(globalContainerReducer(originalState, globalContainerActions.closeDrawer())).toEq(expectedResult);
  });

  it('should handle openAccount action', () => {
    const originalState = state.set('isAccountOpen', false);
    const expectedResult = state.set('isAccountOpen', true);

    expect(globalContainerReducer(originalState, globalContainerActions.openAccount())).toEq(expectedResult);
  });

  it('should handle closeAccount action', () => {
    const originalState = state.set('isAccountOpen', true);
    const expectedResult = state.set('isAccountOpen', false);

    expect(globalContainerReducer(originalState, globalContainerActions.closeAccount())).toEq(expectedResult);
  });

  it('should handle login action', () => {
    const credential = { key: 'val' };
    const originalState = state;
    const expectedResult = state.set('credential', fromJS(credential));

    expect(globalContainerReducer(originalState, globalContainerActions.login(credential))).toEq(expectedResult);
  });

  it('should handle statusChange action', () => {
    const originalState = state.set('listBallots', fromJS([
      { bId: 'b1', status: 's1', evil: true },
      { bId: 'b2', status: 's2', evil: false },
    ]));
    const param = { bId: 'b2', status: 's3' };
    const expectedResult = state.set('listBallots', fromJS([
      { bId: 'b1', status: 's1', evil: true },
      { bId: 'b2', status: 's3', evil: false },
    ]));

    expect(globalContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
  });

  it('should handle statusChange action null', () => {
    const originalState = state;
    const param = { bId: 'b3', status: 's3' };
    const expectedResult = state;

    expect(globalContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
  });

  it('should handle statusChange action not found', () => {
    const originalState = state.set('listBallots', fromJS([
      { bId: 'b1', status: 's1', evil: true },
      { bId: 'b2', status: 's2', evil: false },
    ]));
    const param = { bId: 'b3', status: 's3' };
    const expectedResult = state.set('listBallots', fromJS([
      { bId: 'b1', status: 's1', evil: true },
      { bId: 'b2', status: 's2', evil: false },
    ]));

    expect(globalContainerReducer(originalState, subscriptionContainerActions.statusChange(param))).toEq(expectedResult);
  });

  // Sagas
  it('should handle ballots request', () => {
    const originalState = state.set('isLoading', false);
    const expectedResult = state.set('isLoading', true);

    expect(globalContainerReducer(originalState, globalContainerActions.ballotsRequest())).toEq(expectedResult);
  });

  it('should handle ballots success', () => {
    const ballots = [{ key: 'val' }];
    const originalState = state.set('isLoading', true);
    const result = { ballots };
    const expectedResult = state.set('isLoading', false)
      .set('listBallots', fromJS(ballots));

    expect(globalContainerReducer(originalState, globalContainerActions.ballotsSuccess(result))).toEq(expectedResult);
  });

  it('should handle ballots failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { key: 'value' };
    const expectedResult = state.set('isLoading', false)
      .set('error', fromJS(error));

    expect(globalContainerReducer(originalState, globalContainerActions.ballotsFailure(error))).toEq(expectedResult);
  });
});
