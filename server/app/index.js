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
const { expressTh } = require('./throttle');
const logger = require('../logger')('index');

const router = express.Router();

router.use(cors({
  origin: [
    process.env.CORS_ORIGIN,
    /^https?:\/\/localhost(:\d+)?$/,
  ],
  methods: ['HEAD', 'GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 300000,
}));

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
  expressTh('graphql', { max: 10, duration: 5000 }, (req) => req.ip),
  nocache(),
  bodyParser.json(),
  passport.initialize(),
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
      ip: req.ip,
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

router.post(
  '/secret/tickets',
  anony(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  async (req, res, next) => {
    logger.info('POST /secret/tickets');
    logger.info('Anony', req.anony);
    try {
      switch (req.accepts(['json', 'html'])) {
        case 'json': {
          logger.debug('Requesting json');
          req.targetObj = req.body;
          req.responseEnc = 'json';
          next();
          return;
        }
        case 'html': {
          logger.debug('Requesting html');
          const buf = Buffer.from(req.body.enc, 'base64');
          const j = JSON.parse(buf.toString('utf8'));
          logger.trace('Parsing base64 succeed');
          req.targetObj = j;
          req.responseEnc = 'html';
          next();
          return;
        }
        default:
          res.status(406).send();
      }
    } catch (e) {
      next(e);
    }
  },
  expressTh('GET tickets', { max: 1, duration: 60000 }, (req) => req.targetObj.t),
  async (req, res) => {
    const rst = await submitTicket(req.targetObj);
    switch (req.targetEnc) {
      case 'json': {
        res.status(rst.status).json(rst.json);
        return;
      }
      case 'html': {
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
  },
);

router.get(
  '/secret/tickets/',
  expressTh('GET tickets', { max: 1, duration: 5000 }, (req) => req.query.tId),
  anony(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  async (req, res, next) => {
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
  },
);

module.exports = router;
