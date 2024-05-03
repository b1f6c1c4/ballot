const EventEmitter = require('node:events');
const logger = require('./logger')('rpc');

const ev = new EventEmitter();

module.exports = {
  sPublish(ex, body) {
    logger.trace('Publish (S) to', ex);
    logger.trace('Body', body);
    ev.emit(ex, body);
  },
  subscribe(key, cb) {
    logger.debug('S q.subscribe...');
    const listener = (body) => {
      logger.debug('Message from S', key);
      logger.trace('Body', body);
      try {
        cb(key, body);
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
