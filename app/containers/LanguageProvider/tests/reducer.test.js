import { DEFAULT_LOCALE } from 'i18n';

import { CHANGE_LOCALE } from '../constants';

describe('languageProviderReducer', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('returns browser locale', () => {
    jest.mock('browser-locale', () => jest.fn(() => 'zh-CN'));
    const languageProviderReducer = require('../reducer').default; // eslint-disable-line global-require
    expect(languageProviderReducer(undefined, {}).toJS()).toEqual({
      locale: 'zh',
    });
  });

  it('fallbacks to DEFAULT_LOCALE', () => {
    jest.mock('browser-locale', () => jest.fn(() => null));
    const languageProviderReducer = require('../reducer').default; // eslint-disable-line global-require
    expect(languageProviderReducer(undefined, {}).toJS()).toEqual({
      locale: DEFAULT_LOCALE,
    });
  });

  it('changes the locale', () => {
    jest.mock('browser-locale', () => jest.fn(() => null));
    const languageProviderReducer = require('../reducer').default; // eslint-disable-line global-require
    expect(languageProviderReducer(undefined, { type: CHANGE_LOCALE, locale: 'de' }).toJS()).toEqual({
      locale: 'de',
    });
  });
});
