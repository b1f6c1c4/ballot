import { fromJS } from 'immutable';

import * as snackbarContainerActions from '../actions';
import snackbarContainerReducer from '../reducer';

describe('snackbarContainerReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isOpen: false,
      message: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(snackbarContainerReducer(undefined, {})).toEq(expectedResult);
  });

  // Actions
  it('should handle snackbarRequest action', () => {
    const originalState = state;
    const message = { key: 'v' };
    const expectedResult = state;

    expect(snackbarContainerReducer(originalState, snackbarContainerActions.snackbarRequest(message))).toEq(expectedResult);
  });

  it('should handle snackbarShow action', () => {
    const originalState = state;
    const message = { key: 'v' };
    const expectedResult = state.set('isOpen', true)
      .set('message', fromJS(message));

    expect(snackbarContainerReducer(originalState, snackbarContainerActions.snackbarShow(message))).toEq(expectedResult);
  });

  it('should handle snackbarHide action', () => {
    const originalState = state.set('isOpen', true);
    const expectedResult = state.set('isOpen', false);

    expect(snackbarContainerReducer(originalState, snackbarContainerActions.snackbarHide())).toEq(expectedResult);
  });

  // Sagas
});
