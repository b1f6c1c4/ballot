const { Ballot } = require('../models/ballots');
const logger = require('../logger')('newRing');

const newRing = async (res, con) => {
  try {
    const { _id } = con;
    const { q, g } = res;
    logger.debug('Finalize newRing...', _id);
    await Ballot.findOneAndUpdate({
      _id,
      status: 'creating',
    }, {
      $set: {
        status: 'inviting',
        crypto: { q, g },
      },
    }, {
      upsert: false,
    });
    logger.info('Crypto param created', _id);
  } catch (e) {
    logger.error('Finalize newRing', e);
  }
};

module.exports = newRing;
