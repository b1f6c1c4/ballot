import { fromJS } from 'immutable';

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
      currentBallot: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(globalContainerReducer(undefined, {})).toEqual(expectedResult);
  });

  // Actions
  it('should handle openDrawer action', () => {
    const originalState = state.set('isDrawerOpen', false);
    const expectedResult = state.set('isDrawerOpen', true);

    expect(globalContainerReducer(originalState, globalContainerActions.openDrawer())).toEqual(expectedResult);
  });

  it('should handle closeDrawer action', () => {
    const originalState = state.set('isDrawerOpen', true);
    const expectedResult = state.set('isDrawerOpen', false);

    expect(globalContainerReducer(originalState, globalContainerActions.closeDrawer())).toEqual(expectedResult);
  });

  it('should handle openAccount action', () => {
    const originalState = state.set('isAccountOpen', false);
    const expectedResult = state.set('isAccountOpen', true);

    expect(globalContainerReducer(originalState, globalContainerActions.openAccount())).toEqual(expectedResult);
  });

  it('should handle closeAccount action', () => {
    const originalState = state.set('isAccountOpen', true);
    const expectedResult = state.set('isAccountOpen', false);

    expect(globalContainerReducer(originalState, globalContainerActions.closeAccount())).toEqual(expectedResult);
  });

  it('should handle login action', () => {
    const credential = { key: 'val' };
    const originalState = state;
    const expectedResult = state.set('credential', fromJS(credential));

    expect(globalContainerReducer(originalState, globalContainerActions.login(credential))).toEqual(expectedResult);
  });

  it('should handle logout action', () => {
    const originalState = state.set('credential', { key: 'val' });
    const expectedResult = state;

    expect(globalContainerReducer(originalState, globalContainerActions.logout())).toEqual(expectedResult);
  });

  // Sagas
  it('should handle ballots request', () => {
    const originalState = state.set('isLoading', false);
    const expectedResult = state.set('isLoading', true);

    expect(globalContainerReducer(originalState, globalContainerActions.ballotsRequest())).toEqual(expectedResult);
  });

  it('should handle ballots success', () => {
    const ballots = [{ key: 'val' }];
    const originalState = state.set('isLoading', true);
    const result = { ballots };
    const expectedResult = state.set('isLoading', false)
      .set('listBallots', fromJS(ballots));

    expect(globalContainerReducer(originalState, globalContainerActions.ballotsSuccess(result))).toEqual(expectedResult);
  });

  it('should handle ballots failure', () => {
    const originalState = state.set('isLoading', true);
    const error = { };
    const expectedResult = state.set('isLoading', false);

    expect(globalContainerReducer(originalState, globalContainerActions.ballotsFailure(error))).toEqual(expectedResult);
  });
});
