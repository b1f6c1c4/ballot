const { RateLimiterMongo, RateLimiterMemory } = require("rate-limiter-flexible");
const { getConnection } = require('../mongo');
const logger = require('../logger')('throttle');

const masterLimiter = new RateLimiterMemory({
  points: 30,
  duration: 5,
  blockDuration: 3600,
});
const limiters = {};

module.exports.ban = (log, id) => {
  if (!id || !(log in limiters))
    return;

  limiters[log].block(id, 2 * 3600); // 2 hours
  masterLimiter.block(id, 600); // 10 minutes
};

module.exports.customTh = async (log, par, id) => {
  await masterLimiter.consume(id, 1);

  let limiter;
  if (!(log in limiters)) {
    logger.info(`New limiter ${log} incorporated`, par);
    limiter = limiters[log] = new RateLimiterMongo({
      storeClient: getConnection(),
      keyPrefix: `ratelimiter.${log}`,
      blockDuration: 60,
      insuranceLimiter: new RateLimiterMemory({
        ...par,
      }),
      ...par,
    });
  } else {
    limiter = limiters[log];
  }

  try {
    await limiter.consume(id, 1);
  } catch (e) {
    throw e.msBeforeNext;
  }
};

module.exports.expressTh = (log, par, idGetter) => (req, res, next) => {
  const id = idGetter(req);

  module.exports.customTh(log, par, id)
    .then(() => next())
    .catch((e) => {
      if (e.msBeforeNext) {
        const after = Math.round(e.msBeforeNext / 1000) || 1;
        res.set('Retry-After', after);
        res.status(429).send(`Too Many Requests: ${log}`);
      } else {
        res.status(429).send('Too Many Requests');
      }
    });
};
