const Redis = require('ioredis');
const logger = require('./logger')('redis');

let db;

const makeRedis = () => {
  Redis.Promise.onPossiblyUnhandledRejection((error) => {
    logger.error('Redis rej', error);
  });
  const password = process.env.REDIS_PASS
    ? process.env.REDIS_PASS
    : null;
  const host = process.env.REDIS_HOST || 'localhost';
  const port = process.env.REDIS_PORT || 6379;
  logger.info('Redis host', host);
  logger.info('Redis port', port);
  const redis = new Redis({
    host,
    port,
    password,
  });
  db = redis;
};

module.exports.connect = makeRedis;
module.exports.getDb = () => db;
