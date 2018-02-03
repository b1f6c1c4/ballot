const _ = require('lodash');
const express = require('express');
const cors = require('cors');
const nocache = require('nocache');
const bodyParser = require('body-parser');
const passport = require('passport');
const { graphqlExpress } = require('apollo-server-express');
const status = require('../status');
const anony = require('./anonymity');
const { submitTicket, checkTicket } = require('./secret');
const { schema } = require('./graphql');
const { auth } = require('./auth');
const logger = require('../logger')('index');

const router = express.Router();

router.use(cors({
  origin: '*',
  methods: ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

router.use(nocache(), bodyParser.json(), passport.initialize());

router.get('/', (req, res) => {
  logger.trace('GET /');
  if (status) {
    res.status(200).json(status);
  } else {
    res.status(500).send();
  }
});

router.use(
  '/graphql',
  auth,
  bodyParser.text({
    type: 'application/graphql',
  }),
  (req, res, next) => {
    logger.info(`${req.method} /graphql`);
    if (req.is('application/graphql')) {
      req.body = { query: req.body };
    }
    next();
  },
  graphqlExpress((req) => ({
    schema,
    context: {
      auth: req.user,
    },
    tracing: process.env.NODE_ENV !== 'production',
    formatError: (err) => {
      const e = {
        message: err.message,
        statusCode: _.get(err, 'originalError.statusCode'),
        errorCode: _.get(err, 'originalError.errorCode'),
      };
      logger.trace('Return err', e);
      return e;
    },
  })),
);

router.get('/secret', anony(false), (req, res) => {
  logger.trace('GET /secret');
  const { version, commitHash } = status;
  if (status) {
    res.status(200).json({
      version,
      commitHash,
      ip: req.ip,
      error: req.anony.error,
      isTor: req.anony.isTor,
      headers: req.headers,
    });
  } else {
    res.status(500).send();
  }
});

router.use('/secret', anony(), bodyParser.urlencoded({
  extended: false,
}));

router.post('/secret/tickets', async (req, res, next) => {
  logger.info('POST /secret/tickets');
  logger.info('Anony', req.anony);
  try {
    switch (req.accepts(['json', 'html'])) {
      case 'json': {
        logger.debug('Requesting json');
        const rst = await submitTicket(req.body);
        logger.debug('Resposne status', rst.status);
        res.status(rst.status).json(rst.json);
        return;
      }
      case 'html': {
        logger.debug('Requesting html');
        const buf = Buffer.from(req.body.enc, 'base64');
        const j = JSON.parse(buf.toString('utf8'));
        logger.trace('Parsing base64 succeed');
        const rst = await submitTicket(j);
        logger.debug('Resposne status', rst.status);
        if (rst.status === 202) {
          res.status(rst.status).send(`Ticket staged. Your tId is <pre>${rst.json.tId}</pre>`);
        } else {
          res.status(rst.status)
            .send(`Error occured: <pre>${rst.json.error.code}</pre>
<pre>${rst.json.error.message}</pre>`);
        }
        return;
      }
      default:
        res.status(406).send();
    }
  } catch (e) {
    next(e);
  }
});

router.get('/secret/tickets/', async (req, res, next) => {
  logger.info('GET /secret/tickets/?tId=', req.query.tId);
  logger.info('Anony', req.anony);
  try {
    switch (req.accepts(['json', 'html'])) {
      case 'json': {
        logger.debug('Requesting json');
        const rst = await checkTicket(req.query.tId);
        logger.debug('Resposne status', rst.status);
        res.status(rst.status).json(rst.json);
        return;
      }
      case 'html': {
        logger.debug('Requesting html');
        const rst = await checkTicket(req.query.tId);
        logger.debug('Resposne status', rst.status);
        if (rst.status === 202) {
          res.status(rst.status).send('Still processing.');
        } else if (rst.status === 204) {
          res.status(200).send('Success.');
        } else {
          res.status(rst.status)
            .send(`Error occured: <pre>${rst.json.error.code}</pre>
<pre>${rst.json.error.message}</pre>`);
        }
        return;
      }
      default:
        res.status(406).send();
    }
  } catch (e) {
    next(e);
  }
});

router.get('*', (req, res) => res.status(404).send());

module.exports = router;
