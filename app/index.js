import $ from 'jquery';
import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
import LngDetector from 'i18next-browser-languagedetector';
import { mapValues } from 'lodash';
import rawResources from './translations';

function updateContent() {
  $('*').localize();
}

i18next.use(LngDetector).init({
  fallbackLng: 'en',
  keySeparator: '/',
  resources: mapValues(rawResources, (lo) => ({
    translation: lo,
  })),
}, (err) => {
  if (err) {
    throw err;
  }
  jqueryI18next.init(i18next, $);
  updateContent();
}).on('languageChanged', () => {
  $('#lng').val(i18next.language);
  updateContent();
});

$('#lng').change(() => {
  i18next.changeLanguage($('#lng').val());
});
