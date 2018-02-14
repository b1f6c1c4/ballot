const amqp = require('amqp');
const logger = require('./logger')('rpc');

let connection;
let npName;
let npCallId = 0;
let pMessage;
let sExchange;
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
    npCallFulfills.delete(reply);
    logger.trace('Get reply ID done', reply);
    const { resolve, reject } = fulfill;
    if (data.error) {
      logger.debug('Dealing with errored message from NP...');
      reject(data.error);
      logger.trace('Dealing with errored message from NP done');
    } else {
      logger.debug('Dealing with message from NP...');
      resolve(data.result);
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
    logger.debug('P q.bind...');
    q.bind('#');
    logger.debug('P q.subscribe...');
    q.subscribe(cbP);
    logger.info(`P queue ${q.name} ready`);
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
    logger.debug('NP q.bind...');
    q.bind('#');
    logger.debug('NP q.subscribe...');
    q.subscribe(cbNP);
    logger.info(`NP queue ${q.name} ready`);
    resolve();
  });
});

const makeQueueS = () => new Promise((resolve) => {
  connection.exchange('topic_subscription', {
    type: 'topic',
    durable: true,
    autoDelete: false,
    noDeclare: false,
  }, (ex) => {
    logger.debug('S exchange created');
    sExchange = ex;
    resolve();
  });
});

const connect = () => new Promise((resolve, reject) => {
  if (process.env.NODE_ENV === 'test') {
    logger.fatalDie('AMQP is not for test!');
    // hangs there
    return;
  }

  logger.info('Connecting AMQP...');
  logger.debug('AMQP host', process.env.RABBIT_HOST);
  logger.debug('AMQP user', process.env.RABBIT_USER);
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

    Promise.all([makeQueueP(), makeQueueNP(), makeQueueS()])
      .then(resolve)
      .catch(reject);
  });
});

let queues = {};
try {
  const cfg = process.env.CRYPTOR_QUEUE;
  logger.debug('CRYPTOR_QUEUE', cfg);
  if (!cfg) {
    logger.warn('No queue env found, use default', 'cryptor');
  } else {
    queues = JSON.parse(cfg);
    logger.info('Cryptor queues', queues);
  }
} catch (e) {
  logger.error('Parsing CRYPTOR_QUEUE', e);
}

const resolveQueue = (method) => {
  if (!queues || !queues[method]) {
    return 'cryptor';
  }
  return queues[method];
};

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
  const qu = resolveQueue(method);
  logger.trace('Method', method);
  logger.debug('Publish to', qu);
  connection.publish(qu, JSON.stringify(body), {
    mandatory: true,
    contentType: 'application/json',
    deliveryMode: 2,
    replyTo: 'backend',
  }, (e) => {
    if (e) {
      logger.error('Publish', e);
      reject(e);
      return;
    }

    resolve();
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
  logger.debug('Set npCallFulfills', id);
  npCallFulfills.set(body.id, { resolve, reject });
  const qu = resolveQueue(method);
  logger.trace('Method', method);
  logger.debug('Publish to', qu);
  connection.publish(qu, JSON.stringify(body), {
    mandatory: true,
    contentType: 'application/json',
    deliveryMode: 2,
    replyTo: npName,
  });
});

const rawPublish = (ex, body) => new Promise((resolve, reject) => {
  logger.debug('Raw Publish to', ex);
  connection.publish(ex, body, {
    deliveryMode: 1,
  }, (e) => {
    if (e) {
      logger.error(e);
      reject(e);
      return;
    }

    resolve();
  });
});

const subscribe = (key, cb) => new Promise((resolve) => {
  connection.queue('', {
    durable: false,
    exclusive: true,
    autoDelete: true,
    noDeclare: false,
    closeChannelOnUnsubscribe: true,
  }, (q) => {
    npName = q.name;
    logger.debug('S q.bind...', key);
    q.bind(sExchange, key);
    logger.debug('S q.subscribe...');
    q.subscribe((msg) => {
      logger.debug('Message from S', key);
      logger.warn('SHIT', msg);
      cb(msg);
    });
    logger.info(`S queue ${q.name} ready`, key);
    resolve(() => {
      logger.debug(`Destroy queue ${q.name}`, key);
      q.destroy();
      logger.info(`S queue ${q.name} destroyed`, key);
    });
  });
});

module.exports = {
  connect,
  publish,
  call,
  rawPublish,
  subscribe,
  onPMessage(cb) { pMessage = cb; },
};
