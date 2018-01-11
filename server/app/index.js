const express = require('express');
const cors = require('cors');
const nocache = require('nocache');
const bodyParser = require('body-parser');
const { makeExecutableSchema } = require('graphql-tools');
const { graphqlExpress } = require('apollo-server-express');
const fs = require('fs');
const passport = require('passport');
const anony = require('./anonymity');

const router = express.Router();

router.use(cors({
  origin: '*',
  methods: ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

router.use(nocache(), bodyParser.json(), passport.initialize());

let theStatus;
fs.readFile('VERSION.json', 'utf8', (err, data) => {
  if (!err) {
    theStatus = JSON.parse(data);
  }
});

const typeDefs = fs.readFileSync('./docs/public.graphql', 'utf8');
const resolvers = {
  Query: {
    status: () => theStatus,
  },
};
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
const graphqlParser = [
  bodyParser.text({ type: 'application/graphql' }),
  (req, res, next) => {
    if (req.is('application/graphql')) {
      req.body = { query: req.body };
    }
    next();
  },
];
router.use('/graphql', ...graphqlParser, graphqlExpress({
  schema,
  tracing: process.env.NODE_ENV !== 'production',
  formatError: (err) => {
    if (err.originalError && err.originalError.error_message) {
      // eslint-disable-next-line no-param-reassign
      err.message = err.originalError.error_message;
    }

    return err;
  },
}));

router.get('/', (req, res) => {
  if (theStatus) {
    res.status(200).json(theStatus);
  } else {
    res.status(500).send();
  }
});

router.get('/secret', anony(false), (req, res) => {
  if (theStatus) {
    res.status(200).json({
      version: theStatus.version,
      commitHash: theStatus.commitHash,
      ip: req.ip,
      error: req.anony.error,
      isTor: req.anony.isTor,
      headers: req.headers,
    });
  } else {
    res.status(500).send();
  }
});

router.get('*', (req, res) => res.status(404).send());

module.exports = router;
