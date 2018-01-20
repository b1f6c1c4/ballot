const express = require('express');
const argv = require('minimist')(process.argv.slice(2));
const { graphiqlExpress } = require('apollo-server-express');
const api = require('./app');
const rpc = require('./rpc');
const mongo = require('./mongo');
const logger = require('./logger')('index');

process.on('unhandledRejection', (e) => {
  logger.fatal('Unhandled rejection', e);
  throw e;
});

const isDev = process.env.NODE_ENV !== 'production';
// eslint-disable-next-line import/newline-after-import
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const app = express();

app.set('trust proxy', true);
app.use('/api', api);
if (process.env.NODE_ENV !== 'production') {
  app.get('/graphql', graphiqlExpress({
    endpointURL: '/api/graphql',
  }));
}

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';
const port = parseInt(argv.port || process.env.PORT || '3000', 10);

function appStarted(p, h, t) {
  logger.info(`Server started ${h}:${p}`);
  if (t) {
    logger.info(`Tunnel initialized ${t}`);
  }
}

function runApp() {
  app.listen(port, host, (err) => {
    if (err) {
      logger.fatal(err);
      process.exit(1);
      return;
    }

    // Connect to ngrok in dev mode
    if (ngrok) {
      ngrok.connect(port, (innerErr, url) => {
        if (innerErr) {
          logger.fatal(innerErr);
          process.exit(1);
          return;
        }

        appStarted(port, prettyHost, url);
      });
    } else {
      appStarted(port, prettyHost);
    }
  });
}

rpc.onPMessage((err, res, con) => {
  if (err) {
    logger.warn('Errored message from P', err);
  }
  logger.info('RES', res);
  logger.info('CON', con);
});

const initRpc = rpc.connect()
  .then(() => {
    rpc.publish('status');
    rpc.call('status')
      .then((res) => {
        logger.info('Status', res);
      }).catch((err) => {
        logger.warn('Status', err);
      });
  });

const initDb = mongo.connect();

Promise.all([initRpc, initDb])
  .then(runApp)
  .catch((e) => {
    logger.fatal('Init failed', e);
    process.exit(1);
  });
