const jwt = require('jsonwebtoken');
const passport = require('passport');
const Strategy = require('passport-strategy');
const logger = require('../logger')('auth');

const signOptions = {
  issuer: 'ballot',
  audience: 'ballot',
  expiresIn: '2h',
};

const verifyOptions = {
  issuer: 'ballot',
  audience: 'ballot',
  ignoreExpiration: false,
  maxAge: '2h',
};

const secret = process.env.JWT_SECRET || 's3cReT';

const core = (auth) => {
  try {
    logger.trace('Auth', auth);
    if (!auth) {
      return null;
    }

    const match = auth.match(/^(?:bearer|JWT) ([a-zA-Z0-9+/=]+\.[a-zA-Z0-9+/=]+\.[-_a-zA-Z0-9+/=]+)$/i);
    if (!match) {
      logger.debug('Malformed auth', auth);
      return { error: 'hhmf' };
    }

    logger.trace('Verifing JWT...', match[1]);
    const decoded = jwt.verify(match[1], secret, verifyOptions);
    logger.debug('JWT verified', decoded);
    logger.info('JWT verified username', decoded.username);
    return decoded;
  } catch (err) {
    logger.debug('Verifing JWT error', err);
    return { error: err };
  }
};

class TryJWTStrategy extends Strategy {
  constructor() {
    super();

    this.name = 'try-jwt';
    Strategy.call(this);
  }

  authenticate(req) {
    const cred = req.headers.authorization;
    const auth = core(cred);
    this.success(auth);
  }
}

passport.use(new TryJWTStrategy());

module.exports = {
  core,
  TryJWTStrategy,
  issue: (payload) => jwt.sign(payload, secret, signOptions),
  auth: passport.authenticate('try-jwt', { session: false }),
};
