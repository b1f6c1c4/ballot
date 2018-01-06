import { fromJS } from 'immutable';

import globalReducer from '../reducer';

import * as GLOBAL from '../constants';
import * as globalActions from '../actions';

describe('globalReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      isDrawerOpen: false,
      credential: null,
    });
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(globalReducer(undefined, {})).toEqual(expectedResult);
  });

  // Actions
  it('should handle toggleDrawerOpen action: close', () => {
    const originalState = state;
    const expectedResult = state.set('isDrawerOpen', true);

    expect(globalReducer(originalState, globalActions.toggleDrawerOpen())).toEqual(expectedResult);
  });

  it('should handle toggleDrawerOpen action: open', () => {
    const originalState = state.set('isDrawerOpen', true);
    const expectedResult = state.set('isDrawerOpen', false);

    expect(globalReducer(originalState, globalActions.toggleDrawerOpen())).toEqual(expectedResult);
  });

  it('should handle updateCredential action', () => {
    const originalState = state;
    const credential = {
      key: 'value',
    };
    const theAction = {
      type: GLOBAL.UPDATE_CREDENTIAL_ACTION,
      credential,
    };
    const expectedResult = state.set('credential', credential);

    expect(globalReducer(originalState, theAction)).toEqual(expectedResult);
  });
});
