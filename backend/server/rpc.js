const EventEmitter = require('node:events');
const logger = require('./logger')('rpc');

const ev = new EventEmitter();

module.exports = {
  sPublish(ex, body) {
    logger.trace('Body', body);
    logger.trace('Publish (S) to', ex);
    ev.emit(ex, ex, body);
    const k = ex.replace(/\.[^.]*$/, '.*');
    if (k !== ex) {
      logger.trace('Publish (S) to', k);
      ev.emit(k, ex, body);
    }
  },
  subscribe(key, cb) {
    logger.debug('S q.subscribe...', key);
    const listener = (ex, body) => {
      logger.debug('Message from S', ex);
      logger.trace('Body', body);
      try {
        cb(ex, body);
      } catch (e) {
        logger.error(`Error from S handler ${key}:`, e);
      }
    };
    ev.addListener(key, listener);
    return () => {
      ev.removeListener(key, listener);
      logger.info('S unsubscribe', key);
    };
  },
};
