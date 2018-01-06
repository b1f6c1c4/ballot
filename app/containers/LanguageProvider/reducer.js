/*
 *
 * LanguageProvider reducer
 *
 */

import { fromJS } from 'immutable';
import browserLocale from 'browser-locale';
import { DEFAULT_LOCALE } from 'i18n';

import { CHANGE_LOCALE } from './constants';

function getLocale() {
  let locale = browserLocale();
  if (locale) {
    [locale] = locale.split('-');
  } else {
    locale = DEFAULT_LOCALE;
  }
  return locale;
}

function languageProviderReducer(state = fromJS({ locale: getLocale() }), action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return state
        .set('locale', action.locale);
    default:
      return state;
  }
}

export default languageProviderReducer;
