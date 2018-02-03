import _ from 'lodash';
import { fromJS } from 'immutable';

import * as VOTER_REG_CONTAINER from './constants';

const initialState = fromJS({
  isLoading: false,
  isRegLoading: false,
  ballot: null,
  error: null,
  privateKey: null,
});

function voterRegContainerReducer(state = initialState, action) {
  switch (action.type) {
    // Actions
    // Sagas
    case VOTER_REG_CONTAINER.REGISTER_REQUEST:
      return state.set('isRegLoading', true);
    case VOTER_REG_CONTAINER.REGISTER_SUCCESS:
      return state.set('isRegLoading', false)
        .set('privateKey', action.privateKey);
    case VOTER_REG_CONTAINER.REGISTER_FAILURE:
      return state.set('isRegLoading', false);
    case VOTER_REG_CONTAINER.REFRESH_REQUEST:
      return state.set('isLoading', true)
        .set('error', null);
    case VOTER_REG_CONTAINER.REFRESH_SUCCESS:
      return state.set('isLoading', false)
        .set('ballot', fromJS(action.result.ballot));
    case VOTER_REG_CONTAINER.REFRESH_FAILURE:
      return state.set('isLoading', false)
        .set('ballot', null)
        .set('error', fromJS(_.toPlainObject(action.error)));
    // Default
    default:
      return state;
  }
}

export default voterRegContainerReducer;