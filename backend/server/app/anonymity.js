const TorTest = require('tor-test');
const logger = require('../logger')('anonymity');

const reject = /* istanbul ignore next */ (req, res) => {
  if (process.env.NODE_ENV === 'test') {
    res.status(403).send();
    return;
  }

  switch (req.accepts(['json', 'html'])) {
    case 'json':
      res.status(403).json({ error: { code: 'anon', message: 'Anonymity broken' } });
      break;
    case 'html':
      res.status(403).send('Error occured: <pre>anon</pre><br><pre>Anonymity broken</pre>');
      break;
    default:
      res.status(403).send();
      break;
  }
};

module.exports = (force = true) => (req, res, next) => {
  const strict = force && !process.env.ANONY_NO_STRICT;

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
      return;
    }

    reject(req, res);
  });
};
