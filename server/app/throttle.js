const Limiter = require('ratelimiter');
const { getDb } = require('../redis');
const logger = require('../logger')('throttle');

module.exports.customTh = (log, par, id) => new Promise((resolve, reject) => {
  if (process.env.NO_REDIS) {
    resolve();
    return;
  }

  const limiter = new Limiter({
    id: `${log}:${id}`,
    db: getDb(),
    ...par,
  });

  limiter.get((err, { total, remaining, reset }) => {
    if (err) {
      reject(err);
      return;
    }

    const now = +Date.now();

    logger.trace(`Throttle ${log}`, {
      id,
      remaining,
      total,
      reset,
      now,
    });

    if (remaining > 0) {
      resolve();
      return;
    }

    const after = (reset + 1) - (now / 1000);
    reject(after);
  });
});

module.exports.expressTh = (log, par, idGetter) => (req, res, next) => {
  if (process.env.NO_REDIS) {
    next();
    return;
  }

  const id = idGetter(req);

  const limiter = new Limiter({
    id: `${log}:${id}`,
    db: getDb(),
    ...par,
  });

  limiter.get((err, { total, remaining, reset }) => {
    if (err) {
      next(err);
      return;
    }

    res.set('X-RateLimit-Limit', total);
    res.set('X-RateLimit-Remaining', remaining - 1);
    res.set('X-RateLimit-Reset', reset);

    const now = +Date.now();

    logger.trace(`Throttle ${log}`, {
      id,
      remaining,
      total,
      reset,
      now,
    });

    if (remaining > 0) {
      next();
      return;
    }

    const after = (reset + 1) - (now / 1000);
    res.set('Retry-After', after);
    res.status(429).send(`Rate limit exceeded, retry after ${after.toFixed(0)}s`);
  });
};
