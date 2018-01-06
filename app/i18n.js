import { cloneDeep, mapValues, mergeWith } from 'lodash';
import { addLocaleData } from 'react-intl';

// eslint-disable-next-line import/no-unresolved, import/extensions
import rawResources from './translations';

export const DEFAULT_LOCALE = 'zh'; // When can't find browser locale
export const ROOT_LOCALE = 'en'; // Fallback when there is no translation

export const appLocales = Object.keys(rawResources);
Array.forEach(appLocales, (k) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const lo = require(`react-intl/locale-data/${k}`);
  addLocaleData(lo);
});

export const translationMessages = mapValues(
  rawResources,
  /* istanbul ignore next */ (msg) => mergeWith(
    cloneDeep(msg),
    rawResources[ROOT_LOCALE],
    (obj, src) => (obj || src),
  ),
);
