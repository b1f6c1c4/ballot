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

class TryJWTStrategy extends Strategy {
  constructor() {
    super();

    this.name = 'try-jwt';
    Strategy.call(this);
  }

  authenticate(req) {
    try {
      const auth = req.headers.authorization;
      logger.trace('Auth', auth);
      if (!auth) {
        this.success(null);
        return;
      }

      const match = auth.match(/^(?:bearer|JWT) ([a-zA-Z0-9+/=]+\.[a-zA-Z0-9+/=]+\.[-_a-zA-Z0-9+/=]+)$/i);
      if (!match) {
        logger.debug('Malformed auth', auth);
        this.success({
          error: 'hhmf',
        });
        return;
      }

      logger.trace('Verifing JWT...', match[1]);
      jwt.verify(match[1], secret, verifyOptions, (err, decoded) => {
        if (err) {
          logger.debug('Verifing JWT error', err);
          this.success({
            error: err,
          });
        } else {
          logger.info('JWT verified', decoded);
          this.success(decoded);
        }
      });
    } catch (err) {
      logger.error('Auth', err);
      /* istanbul ignore next */
      this.error(err);
    }
  }
}

passport.use(new TryJWTStrategy());

module.exports = {
  TryJWTStrategy,
  issue: (payload) => jwt.sign(payload, secret, signOptions),
  auth: passport.authenticate('try-jwt', { session: false }),
};
