const fs = require('fs');
const logger = require('./logger')('status');

let status;
try {
  logger.trace('Read VERSION.json');
  status = JSON.parse(fs.readFileSync('VERSION.json', 'utf8'));
  logger.info('Status', status);
} catch (e) {
  logger.warn('Reading VERSION.json', e);
}

module.exports = status;
