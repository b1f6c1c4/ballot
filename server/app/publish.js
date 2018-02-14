const { sPublish } = require('../rpc');
const logger = require('../logger')('publish');

module.exports = {
  async updateBallotStatus(ballot) {
    logger.trace('updateBallotStatus', ballot);
    const { owner, _id, status } = ballot;
    const k = `status.${owner}.${_id}`;
    logger.debug('Publish status change', status);
    logger.debug('To', k);
    await sPublish(k, status);
  },
};
