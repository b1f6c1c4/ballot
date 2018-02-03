import { DEFAULT_LOCALE } from 'utils/i18n';

import * as LANGUAGE_PROVIDER from '../constants';

describe('languageProviderReducer', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return browser locale', () => {
    jest.mock('browser-locale', () => jest.fn(() => 'zh-CN'));
    const languageProviderReducer = require('../reducer').default; // eslint-disable-line global-require
    expect(languageProviderReducer(undefined, {})).toEq({
      locale: 'zh',
    });
  });

  it('should fallback to DEFAULT_LOCALE', () => {
    jest.mock('browser-locale', () => jest.fn(() => null));
    const languageProviderReducer = require('../reducer').default; // eslint-disable-line global-require
    expect(languageProviderReducer(undefined, {})).toEq({
      locale: DEFAULT_LOCALE,
    });
  });

  it('should change the locale', () => {
    jest.mock('browser-locale', () => jest.fn(() => null));
    const languageProviderReducer = require('../reducer').default; // eslint-disable-line global-require
    expect(languageProviderReducer(undefined, {
      type: LANGUAGE_PROVIDER.CHANGE_LOCALE_ACTION,
      locale: 'de',
    })).toEq({
      locale: 'de',
    });
  });
});
