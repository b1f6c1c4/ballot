const { createServer } = require('http');
const express = require('express');
const argv = require('minimist')(process.argv.slice(2));
const { graphiqlExpress } = require('apollo-server-express');
const api = require('./app');
const { makeServer } = require('./app/graphql');
const cryptor = require('./cryptor.node');
const mongo = require('./mongo');
const redis = require('./redis');
const logger = require('./logger')('index');

logger.info('Versions', process.versions);

process.on('unhandledRejection', (e) => {
  logger.fatal('Unhandled rejection', e);
  throw e;
});

process.on('uncaughtException', (e) => {
  logger.fatalDie('Uncaught exception', e);
});

process.on('warning', (e) => {
  logger.warn('Node warning', e);
});

process.on('SIGINT', () => {
  logger.fatalDie('SIGINT received');
});

process.on('SIGTERM', () => {
  logger.fatalDie('SIGTERM received');
});

const app = express();

app.set('trust proxy', true);
app.use('/api', api, (req, res) => res.status(404).send());

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';
const port = parseInt(argv.port || process.env.PORT || '3000', 10);

if (process.env.NODE_ENV !== 'production') {
  app.get('/graphql', graphiqlExpress({
    endpointURL: '/api/graphql',
    subscriptionsEndpoint: `ws://${prettyHost}:${port}/api/subscriptions`,
  }));
}

function appStarted(p, h, t) {
  logger.info(`Server started ${h}:${p}`);
  if (t) {
    logger.info(`Tunnel initialized ${t}`);
  }
}

function runApp() {
  logger.debug('http.createServer ...');
  const server = createServer(app);
  server.listen(port, host, (err) => {
    if (err) {
      logger.fatalDie(err);
      return undefined;
    }

    // Add websocket
    const ws = makeServer(server);

    appStarted(port, prettyHost);

    return ws;
  });
}

logger.info('cryptor status:', cryptor.status());

const inits = [];
inits.push(mongo.connect());

if (!process.env.NO_REDIS) {
  inits.push(redis.connect());
} else {
  logger.warn('Redis omitted.');
}

Promise.all(inits)
  .then(runApp)
  .catch((e) => {
    logger.fatalDie('Init failed', e);
  });
