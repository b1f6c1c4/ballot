const express = require('express');
const mongoose = require('mongoose');
const argv = require('minimist')(process.argv.slice(2));
const { graphiqlExpress } = require('apollo-server-express');
const api = require('./app');
const logger = require('./logger');
const shard = require('./shard');

process.on('unhandledRejection', (up) => { throw up; });

const isDev = process.env.NODE_ENV !== 'production';
// eslint-disable-next-line import/newline-after-import
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const app = express();

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

mongoose.connection.on('connected', () => {
  logger.info('Mongoose default connection open');
});
mongoose.connection.on('error', (err) => {
  logger.info(`Mongoose default connection error: ${err}`);
});
mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose default connection disconnected');
});

function runApp() {
  app.listen(port, host, (err) => {
    if (err) {
      return logger.error(err.message);
    }

    // Connect to ngrok in dev mode
    if (ngrok) {
      ngrok.connect(port, (innerErr, url) => {
        if (innerErr) {
          return logger.error(innerErr);
        }

        logger.appStarted(port, prettyHost, url);
        return undefined;
      });
    } else {
      logger.appStarted(port, prettyHost);
    }

    return undefined;
  });
}

if (process.env.NODE_ENV === 'test') {
  // TODO
  runApp();
} else {
  shard()
    .then(() => {
      mongoose.useDb('ballot');
      runApp();
    }).catch((err) => {
      logger.error(err);
      logger.info('Use local db');
      mongoose.connect('mongodb://localhost:27017/ballot', (e) => {
        if (e) {
          logger.error(e);
        } else {
          runApp();
        }
      });
    });
}
