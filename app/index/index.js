import _ from 'lodash';

import rawResources from 'translations';

import $ from 'jquery';
import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
import LngDetector from 'i18next-browser-languagedetector';

function updateContent() {
  const ks = i18next.language;
  const [k] = ks.split('-');
  $('#lng').val(k);
  $('body').removeClass();
  $('body').addClass(`body-x-${k}`);
  $('.nav-langs-x').removeClass('menu-item-active');
  $(`.nav-langs-x-${k}`).addClass('menu-item-active');
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
}).on('languageChanged', updateContent);

_.mapValues(rawResources, (lo, k) => {
  const o = $('<li><a href="#"></a></li>');
  $('a', o)
    .addClass('nav-langs-x')
    .addClass(`nav-langs-x-${k}`)
    .attr('data-lang', k)
    .text(lo['index.lang']);
  $('#nav-langs').append(o);
});

$(document).on('click', '#nav-langs a', function onLangClick() {
  const k = $(this).attr('data-lang');
  i18next.changeLanguage(k);
});

$(document).ready(() => {
  updateContent();
});
