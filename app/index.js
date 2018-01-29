import $ from 'jquery';
import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
import LngDetector from 'i18next-browser-languagedetector';
import _ from 'lodash';
import rawResources from './translations';
import './indexStyle';

function updateContent() {
  $('#lng').val(i18next.language);
  $('*').localize();
}

i18next.use(LngDetector).init({
  fallbackLng: 'en',
  keySeparator: '/',
  resources: _.mapValues(rawResources, (lo) => ({
    translation: lo,
  })),
}, (err) => {
  if (err) throw err;
  jqueryI18next.init(i18next, $);
  updateContent();
}).on('languageChanged', updateContent);

_.mapValues(rawResources, (lo, k) => {
  const o = $('<li><a href="#"></a></li>');
  $('a', o)
    .attr('data-lang', k)
    .text(lo['index.lang']);
  $('#nav-langs').append(o);
});

$(document).on('click', '.nav-langs a', function onLangClick() {
  const k = $(this).attr('data-lang');
  i18next.changeLanguage(k);
});
