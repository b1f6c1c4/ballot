/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form/immutable';

import * as GLOBAL_CONTAINER from 'containers/GlobalContainer/constants';
import languageProviderReducer from 'containers/LanguageProvider/reducer';
import globalContainerReducer from 'containers/GlobalContainer/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  location: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.set('location', fromJS(action.payload));
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  const appReducer = combineReducers({
    form: formReducer,
    route: routeReducer,
    language: languageProviderReducer,
    globalContainer: globalContainerReducer,
    ...injectedReducers,
  });

  return (state, action) => {
    switch (action.type) {
      /* istanbul ignore next */
      case GLOBAL_CONTAINER.LOGOUT_ACTION:
        return appReducer(undefined, action);
      default:
        return appReducer(state, action);
    }
  };
}
