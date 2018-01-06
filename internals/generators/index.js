/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const fs = require('fs');
const path = require('path');
const componentGenerator = require('./component/index.js');
const containerGenerator = require('./container/index.js');
const selectorGenerator = require('./container/selector/index.js');
const actionGenerator = require('./container/action/index.js');
const sagaGenerator = require('./container/saga/index.js');
const languageGenerator = require('./language/index.js');
const complexModify = require('./utils/complexModify.js');

module.exports = (plop) => {
  plop.setActionType('complexModify', complexModify);
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('container', containerGenerator);
  plop.setGenerator('selector', selectorGenerator);
  plop.setGenerator('action', actionGenerator);
  plop.setGenerator('saga', sagaGenerator);
  plop.setGenerator('language', languageGenerator);
  plop.setHelper('directory', (comp) => {
    try {
      fs.accessSync(path.join(__dirname, `../../app/containers/${comp}`), fs.F_OK);
      return `containers/${comp}`;
    } catch (e) {
      return `components/${comp}`;
    }
  });
  plop.setHelper('curly', (open) => (open ? '{' : '}'));
  plop.setHelper('ifOr', function ifOr(v1, v2, options) {
    if (v1 || v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
};
