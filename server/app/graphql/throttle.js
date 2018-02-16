const _ = require('lodash');
const errors = require('./error');
const { customTh } = require('../throttle');

module.exports = (log, max, duration) => async (obj) => {
  let id;
  if (_.isObject(obj)) {
    id = obj.ip;
  } else {
    id = obj;
  }
  try {
    await customTh(log, { max, duration }, id);
  } catch (e) {
    if (_.isNumber(e)) {
      throw new errors.TooManyRequestsError(e);
    }
    throw e;
  }
};

