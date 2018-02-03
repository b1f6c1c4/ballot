const _ = require('lodash');
const en = require('../../app/translations/en.json');
const zh = require('../../app/translations/zh.json');

_.assign(module.exports, _.mapValues(
  { en, zh },
  (lst) => _.chain({})
    .assign(en)
    .assign(lst)
    .pickBy((v, k) => /^secret\.|^index.lang$/.test(k))
    .mapKeys((v, k) => k.replace(/^secret\./, ''))
    .value(),
));
