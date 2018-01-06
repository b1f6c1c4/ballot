/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';

import enTranslationMessages from './translations/en.json';
import zhTranslationMessages from './translations/zh.json';

export const DEFAULT_LOCALE = 'zh'; // When can't find browser locale
export const ROOT_LOCALE = 'en'; // Fallback when there is no translation

export const appLocales = [
  'en',
  'zh',
];

addLocaleData(enLocaleData);
addLocaleData(zhLocaleData);

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages = locale !== ROOT_LOCALE
    ? formatTranslationMessages(ROOT_LOCALE, enTranslationMessages)
    : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    let message = messages[key];
    if (!message && locale !== ROOT_LOCALE) {
      message = defaultFormattedMessages[key];
    }
    return Object.assign(formattedMessages, { [key]: message });
  }, {});
};

export const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  zh: formatTranslationMessages('zh', zhTranslationMessages),
};
