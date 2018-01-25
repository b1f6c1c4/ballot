const { Ballot } = require('../models/ballots');
const { SubmittedTicket } = require('../models/submittedTickets');
const { SignedTicket } = require('../models/signedTickets');
const logger = require('../logger')('verify');

const verify = async (res, con) => {
  try {
    const { _id, bId } = con;
    logger.debug('Finalize verify...', _id);
    const { valid } = res;
    let result = valid ? 'accepted' : 'declined';
    const doc = await Ballot.findById(bId, { _id: 0, status: 1 });
    if (!doc) {
      logger.error('Finalize verify: ballot not found', bId);
      return;
    }
    logger.trace('Old ballot', doc);
    if (doc.status !== 'voting') {
      result = 'timeout';
    }
    logger.debug('Result', result);
    const o = await SubmittedTicket.findOneAndUpdate({
      _id,
      status: 'submitted',
    }, {
      $set: {
        status: result,
      },
    }, {
      upsert: false,
    });
    logger.trace('Old ticket', o);
    if (result !== 'accepted') {
      logger.info('Submitted ticket not accepted', _id);
      return;
    }
    const { payload, s, c } = o.ticket;
    await SignedTicket.findOneAndUpdate({
      _id: o.ticket._id,
    }, {
      $set: {
        payload,
        s,
        c,
      },
    }, {
      upsert: true,
      setDefaultsOnInsert: false,
    });
    logger.info('Signed ticket accepted', { tId: _id, t: o.ticket._id });
  } catch (e) {
    logger.error('Finalize verify', e);
  }
};

module.exports = verify;
