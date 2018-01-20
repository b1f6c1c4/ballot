const amqp = require('amqp');
const logger = require('./logger');

let connection;
let npName;
let npCallId = 0;
let pMessage;
const npCallFulfills = new Map();

function cbP(msg) {
  logger.debug('Message from P');

  let data;
  let reply;
  try {
    data = JSON.parse(msg.data.toString('utf8'));
    reply = JSON.parse(data.id);
  } catch (e) {
    logger.error('Parsing message from P', e);
    return;
  }

  if (data.jsonrpc !== '2.0') {
    logger.warn('JSON RPC version incorrect', data.jsonrpc);
  }

  if (!pMessage) {
    if (data.error) {
      logger.warn('Ignoring errored message from P');
    } else {
      logger.warn('Ignoring succeed message from P');
    }
    return;
  }

  try {
    logger.debug('Dealing with message from P...');
    pMessage(data.error, data.result, reply);
    logger.trace('Dealing with message from P done');
  } catch (e) {
    logger.error('Executing message from P', e);
  }
}

function cbNP(msg) {
  logger.debug('Message from NP');

  let data;
  try {
    data = JSON.parse(msg.data.toString('utf8'));
  } catch (e) {
    logger.error('Parsing message from NP', e);
    return;
  }
  if (!Number.isInteger(data.id)) {
    logger.error('Parsing message id from NP', data.id);
    return;
  }
  const reply = data.id;

  if (data.jsonrpc !== '2.0') {
    logger.warn('JSON RPC version incorrect', data.jsonrpc);
  }

  try {
    logger.debug('Get reply ID ...', reply);
    const fulfill = npCallFulfills.get(reply);
    if (fulfill === undefined) {
      logger.warn('Reply ID non-exist', reply);
      return;
    }
    logger.trace('Get reply ID done', reply);
    const { resolve, reject } = fulfill;
    if (data.error) {
      logger.debug('Dealing with errored message from NP...');
      reject(data.error);
      logger.trace('Dealing with errored message from NP done');
    } else {
      logger.debug('Dealing with message from NP...');
      resolve(data.error);
      logger.trace('Dealing with message from NP done');
    }
  } catch (e) {
    logger.error('Executing message from NP', e);
  }
}

const makeQueueP = () => new Promise((resolve) => {
  connection.queue('backend', {
    durable: true,
    exclusive: false,
    autoDelete: false,
    noDeclare: false,
    closeChannelOnUnsubscribe: false,
  }, (q) => {
    logger.debug('AMQP q.bind...');
    q.bind('#');
    logger.debug('AMQP q.subscribe...');
    q.subscribe(cbP);
    logger.info(`AMQP queue ${q.name} ready`);
    resolve();
  });
});

const makeQueueNP = () => new Promise((resolve) => {
  connection.queue('', {
    durable: false,
    exclusive: true,
    autoDelete: true,
    noDeclare: false,
    closeChannelOnUnsubscribe: true,
  }, (q) => {
    npName = q.name;
    logger.debug('AMQP q.bind...');
    q.bind('#');
    logger.debug('AMQP q.subscribe...');
    q.subscribe(cbNP);
    logger.info(`AMQP queue ${q.name} ready`);
    resolve();
  });
});

const connect = () => new Promise((resolve, reject) => {
  logger.info('Connecting AMQP...');
  logger.debug(`AMQP host: ${process.env.RABBIT_HOST}`);
  logger.debug(`AMQP user: ${process.env.RABBIT_USER}`);
  connection = amqp.createConnection({
    host: process.env.RABBIT_HOST || 'localhost',
    port: 5672,
    login: process.env.RABBIT_USER || 'guest',
    password: process.env.RABBIT_PASS || 'guest',
  });

  connection.on('error', (e) => {
    logger.error('AMQP error', e);
  });

  connection.on('ready', () => {
    logger.info('AMQP connection ready');

    Promise.all([makeQueueP(), makeQueueNP()])
      .then(resolve)
      .catch(reject);
  });
});

const publish = (method, param, options) => new Promise((resolve, reject) => {
  const opt = Object.assign({
    reply: {},
  }, options);
  const body = {
    jsonrpc: '2.0',
    method,
    param,
    id: JSON.stringify(opt.reply),
  };
  connection.publish('cryptor', JSON.stringify(body), {
    mandatory: true,
    contentType: 'application/json',
    deliveryMode: 2,
    replyTo: 'backend',
  }, (e) => {
    if (e) {
      logger.error(e);
      reject(e);
      return;
    }

    npCallFulfills.set(body.id, { resolve, reject });
  });
});

const call = (method, param) => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-plusplus
  const id = npCallId++;
  logger.debug('Increment ID', id);
  const body = {
    jsonrpc: '2.0',
    method,
    param,
    id,
  };
  logger.debug('Set npCallFulfills', { id });
  npCallFulfills.set(body.id, { resolve, reject });
  connection.publish('cryptor', JSON.stringify(body), {
    mandatory: true,
    contentType: 'application/json',
    deliveryMode: 2,
    replyTo: npName,
  });
});

module.exports = {
  connect,
  publish,
  call,
  onPMessage(cb) { pMessage = cb; },
};
