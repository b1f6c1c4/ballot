const mongoose = require('mongoose');
const shard = require('./shard');
const logger = require('./logger')('mongo');

const connectLocal = (dbName) => new Promise((resolve, reject) => {
  const host = process.env.MONGO_HOST || 'localhost';
  logger.debug('Mongo host', host);

  mongoose.connection.on('connected', () => {
    logger.info('Mongoose connection open');
    resolve();
  });
  mongoose.connection.on('error', (err) => {
    logger.error('Mongoose connection error', err);
  });
  mongoose.connection.on('disconnected', () => {
    logger.error('Mongoose connection disconnected');
  });
  mongoose.connection.on('reconnect', () => {
    logger.warn('Mongoose connection reconnected');
  });
  mongoose.connection.on('reconnectFailed', () => {
    logger.fatal('Mongoose connection reconnecting failed');
    process.exit(1);
  });

  try {
    logger.info('Connecting mongo db...', dbName);
    mongoose.connect(`mongodb://${host}:27017/${dbName}`, {
      autoIndex: process.env.NODE_ENV !== 'production',
      autoReconnect: true,
      reconnectTries: 0,
      reconnectInterval: 100,
    }).then(resolve, reject);
  } catch (e) {
    logger.error('Calling mongoose.connect', e);
    reject(e);
  }
});

const connect = async () => {
  if (process.env.NODE_ENV === 'test') {
    await connectLocal('ballot-test');
    return;
  }

  try {
    await shard();
    mongoose.useDb('ballot');
    return;
  } catch (e) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('Init shard', e);
      throw e;
    }

    logger.warn('Init shard', e);
  }

  await connectLocal('ballot');
};

module.exports = {
  connect,
};
