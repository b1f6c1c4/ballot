import { fromJS } from 'immutable';

import * as STATUS_PAGE from './constants';

const initialState = fromJS({
  status: {
    version: 'unknown',
    commitHash: 'unknown',
  },
});

function statusContainerReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    case STATUS_PAGE.FETCH_STATUS_ACTION:
      return state;
    // Sagas
    case STATUS_PAGE.CHECK_STATUS_REQUEST:
      return state;
    case STATUS_PAGE.CHECK_STATUS_SUCCESS:
      return state
        .setIn(['status', 'version'], action.result.version)
        .setIn(['status', 'commitHash'], action.result.commitHash);
    case STATUS_PAGE.CHECK_STATUS_FAILURE:
      return state;
    // Default
    default:
      return state;
  }
}

export default statusContainerReducer;
