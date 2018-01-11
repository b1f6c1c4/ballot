const TorTest = require('tor-test');
const logger = require('../logger');

module.exports = (strict = true) => (req, res, next) => {
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
