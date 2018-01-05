const express = require('express');
const cors = require('cors');
const nocache = require('nocache');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const fs = require('fs');

const router = express.Router();

const { Strategy, ExtractJwt } = passportJWT;
const jwtOptions = {
  issuer: 'try-react',
  audience: 'try-react',
  expiresIn: '2h',
};
const pjwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 's3cReT',
  ignoreExpiration: false,
  maxAge: '2h',
  jsonWebTokenOptions: jwtOptions,
};

passport.use(new Strategy(pjwtOptions, (payload, done) => {
  if (typeof payload.username !== 'string') {
    return done(new Error('Malformat'), null);
  }

  // return done(new Error('User not exist'), null);

  return done(null, {
    username: payload.username,
  });
}));

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

router.get('/', (req, res) => {
  if (theStatus) {
    res.status(200).json(theStatus);
  } else {
    res.status(500).send();
  }
});

router.post('/login', (req, res) => {
  const payload = {
    username: req.body.username,
  };
  const token = jwt.sign(payload, pjwtOptions.secretOrKey, jwtOptions);
  res.json({
    message: 'ok',
    token,
  });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => res.status(200).json(req.user));

router.get('*', (req, res) => res.status(501).send());

module.exports = router;
