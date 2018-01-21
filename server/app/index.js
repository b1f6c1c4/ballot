const express = require('express');
const cors = require('cors');
const nocache = require('nocache');
const bodyParser = require('body-parser');
const passport = require('passport');
const status = require('../status');
const anony = require('./anonymity');
const secret = require('./secret');
const graphql = require('./graphql');

const router = express.Router();

router.use(cors({
  origin: '*',
  methods: ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

router.use(nocache(), bodyParser.json(), passport.initialize());

router.get('/', (req, res) => {
  if (status) {
    res.status(200).json(status);
  } else {
    res.status(500).send();
  }
});

router.use('/graphql', ...graphql);

router.get('/secret', anony(false), (req, res) => {
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

router.use('/secret', secret);

router.get('*', (req, res) => res.status(404).send());

module.exports = router;
