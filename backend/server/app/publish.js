const { sPublish } = require('../rpc');
const logger = require('../logger')('publish');

module.exports = {
  async updateBallotStatus(ballot) {
    logger.trace('updateBallotStatus', ballot);
    const { owner, _id, status } = ballot;
    const k = `status.${owner}.${_id}`;
    logger.debug('Publish status change', status);
    logger.debug('To', k);
    sPublish(k, status);
  },

  async updateVoterRegistered(bId, voter) {
    logger.trace('updateVoterRegistered', { bId, ...voter });
    const { _id: iCode, comment, publicKey } = voter;
    const k = `vreg.${bId}.${iCode}`;
    const data = JSON.stringify({
      comment,
      publicKey,
    });
    logger.debug('Publish voter registered', data);
    logger.debug('To', k);
    sPublish(k, data);
  },
};
