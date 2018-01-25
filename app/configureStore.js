/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import persistState from 'redux-localstorage';

import createReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

export const slicer = () => (state) => {
  const forms = state.get('form');
  if (!forms) {
    return state;
  }

  return state.set('form', forms.map((form) => {
    const fields = form.get('registeredFields');
    if (!fields) {
      return form;
    }

    const values = form.get('values');
    if (!values) {
      return form;
    }

    const sensitives = fields.filter((field) => field.get('name').toLowerCase().includes('password')).keys();
    return form.set('values', values.withMutations((vals) => {
      let val = vals;
      // eslint-disable-next-line no-restricted-syntax
      for (const v of sensitives) {
        val = val.remove(v);
      }
      return val;
    }));
  }));
};

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  // 3. logger: State transition log
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
  ];

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test') {
    middlewares.push(logger);
  }

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'test') {
    enhancers.push(persistState(undefined, {
      key: 'ballot',
      slicer,
      deserialize: /* istanbul ignore next */ (raw) => fromJS(JSON.parse(raw)),
      merge: /* istanbul ignore next */ (init, stat) => init.mergeDeep(stat),
    }));
  }

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'Ballot' })
      : compose;
  /* eslint-enable no-underscore-dangle */

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers),
  );

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  return store;
}
