const TorTest = require('tor-test');
const logger = require('../logger')('anonymity');

module.exports = (force = true) => (req, res, next) => {
  const strict = force
    && process.env.NODE_ENV === 'production'
    && !process.env.ANONY_NO_STRICT;

  TorTest.isTor(req.ip, (err, isTor) => {
    if (err) {
      logger.error(err);
    }

    const good = !err && isTor;
    req.anony = {
      err,
      isTor,
      good,
    };

    if (good || !strict) {
      next();
    } else {
      res.status(403).send();
    }
  });
};
