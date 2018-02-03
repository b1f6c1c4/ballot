/**
 * Test store addons
 */

import { fromJS } from 'immutable';
import { browserHistory } from 'react-router-dom';
import configureStore, { slicer as makeSlicer } from '../configureStore';

describe('slicer', () => {
  const slicer = makeSlicer();

  it('should respect normal states', () => {
    const state = {
      key: 'value',
    };
    expect(slicer(fromJS(state))).toEq(state);
  });

  it('should remove isLoading', () => {
    const state = {
      a: { isLoading: 'val', b: { isLoading: 'val' } },
      c: [{ d: 'e', isSthLoading: 'val' }],
    };
    expect(slicer(fromJS(state))).toEq({
      a: { isLoading: false, b: { isLoading: false } },
      c: [{ d: 'e', isSthLoading: false }],
    });
  });

  it('should remove private key', () => {
    const state = {
      a: { privateKey: 'val', b: { privateKeys: 'val' } },
      c: [{ d: 'e', thePrivateKey: 'val' }],
    };
    expect(slicer(fromJS(state))).toEq({
      a: { privateKey: null, b: { privateKeys: null } },
      c: [{ d: 'e', thePrivateKey: null }],
    });
  });

  it('should remove error', () => {
    const state = {
      a: { err: 'val', b: { loadingError: 'val' } },
      c: [{ d: 'e', error: 'val' }],
    };
    expect(slicer(fromJS(state))).toEq({
      a: { err: 'val', b: { loadingError: null } },
      c: [{ d: 'e', error: null }],
    });
  });

  it('should remove language', () => {
    const state = {
      language: 'val',
    };
    expect(slicer(fromJS(state))).toEq({});
  });

  it('should respect null form', () => {
    const state = {
      key: 'value',
      form: {
        theForm: { },
      },
    };
    expect(slicer(fromJS(state))).toEq(state);
  });

  it('should respect empty form', () => {
    const state = {
      key: 'value',
      form: {
        theForm: {
          registeredFields: {
            field: {
              name: 'field',
            },
          },
        },
      },
    };
    expect(slicer(fromJS(state))).toEq(state);
  });

  it('should respect normal form values', () => {
    const state = {
      form: {
        theForm: {
          registeredFields: {
            field: {
              name: 'field',
            },
          },
          values: {
            field: 'some-value',
          },
        },
      },
    };
    expect(slicer(fromJS(state))).toEq(state);
  });

  it('should obliterate password form values', () => {
    const state = {
      form: {
        theForm: {
          registeredFields: {
            somePassword: {
              name: 'somePassword',
            },
          },
          values: {
            somePassword: 'some-value',
          },
        },
      },
    };

    const expectedState = {
      form: {
        theForm: {
          registeredFields: {
            somePassword: {
              name: 'somePassword',
            },
          },
          values: {
          },
        },
      },
    };
    expect(slicer(fromJS(state))).toEq(expectedState);
  });
});

describe('configureStore', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  describe('injectedReducers', () => {
    it('should contain an object for reducers', () => {
      expect(typeof store.injectedReducers).toBe('object');
    });
  });

  describe('injectedSagas', () => {
    it('should contain an object for sagas', () => {
      expect(typeof store.injectedSagas).toBe('object');
    });
  });

  describe('runSaga', () => {
    it('should contain a hook for `sagaMiddleware.run`', () => {
      expect(typeof store.runSaga).toBe('function');
    });
  });
});

describe('configureStore params', () => {
  it('should call window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__', () => {
    /* eslint-disable no-underscore-dangle */
    const compose = jest.fn();
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = () => compose;
    configureStore(undefined, browserHistory);
    expect(compose).toHaveBeenCalled();
    /* eslint-enable no-underscore-dangle */
  });
});
