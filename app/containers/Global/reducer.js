import { fromJS } from 'immutable';

import * as GLOBAL from './constants';

const initialState = fromJS({
  isDrawerOpen: false,
  credential: null,
});

function globalReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    case GLOBAL.TOGGLE_DRAWER_OPEN_ACTION:
      if (state.get('isDrawerOpen')) {
        return state
          .set('isDrawerOpen', false);
      }
      return state
        .set('isDrawerOpen', true);
    case GLOBAL.UPDATE_CREDENTIAL_ACTION:
      return state.set('credential', action.credential);
    // Default
    default:
      return state;
  }
}

export default globalReducer;
