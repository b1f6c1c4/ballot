const _ = require('lodash');
const logger = require('../logger')('tests/mongooseThrower');

module.exports = (model) => {
  logger.info('Hacking model', model.modelName);
  let toThrow = {};
  const verbs = [
    'save',
    'remove',
    'count',
    'find',
    'findOne',
    'findOneAndRemove',
    'findOneAndUpdate',
    'update',
  ];
  verbs.forEach((verb) => {
    logger.trace('Inject hacker for model', verb);
    // eslint-disable-next-line func-names
    model.hooks.pre(verb, function (next) {
      logger.trace('Verb called, hack now', verb);
      const obj = _.get(toThrow, verb);
      if (obj !== undefined) {
        logger.warn('Hacked by', obj);
        expect(this.op).toEqual(verb);
      }
      if (obj) {
        next(obj);
      } else {
        next();
      }
    });
  });
  return (th) => {
    toThrow = th;
  };
};
