const _ = require('lodash');
const { Ballot } = require('../models/ballots');
const { SubmittedTicket } = require('../models/submittedTickets');
const { tIdGen, verify } = require('./cryptor');
const logger = require('../logger')('secret');

const errors = {
  tkmf: {
    status: 400,
    json: { error: { code: 'tkmf', message: 'Ticket malformed' } },
  },
  rsmf: {
    status: 400,
    json: { error: { code: 'rsmf', message: 'Payload result malformed' } },
  },
  xsgn: {
    status: 401,
    json: { error: { code: 'xsgn', message: 'Invalid signature' } },
  },
  ntfd: {
    status: 404,
    json: { error: { code: 'ntfd', message: 'Resource not found' } },
  },
  stna: {
    status: 409,
    json: { error: { code: 'stna', message: 'Ballot status doesn\'t allow the operation' } },
  },
};

const submitTicket = async (data) => {
  logger.debug('secret.submitTicket', data);

  if (Object.keys(data).length !== 4) {
    return errors.tkmf;
  }

  const {
    t,
    payload,
    s,
    c,
  } = data;

  const reg = /^([a-z0-9][a-z0-9])+$/;

  if (!reg.test(t)) {
    return errors.tkmf;
  }
  if (!Array.isArray(s) || !s.every((ss) => reg.test(ss))) {
    return errors.tkmf;
  }
  if (!Array.isArray(c) || !c.every((cc) => reg.test(cc))) {
    return errors.tkmf;
  }
  if (typeof payload !== 'object') {
    return errors.tkmf;
  }
  if (Object.keys(payload).length !== 2) {
    return errors.tkmf;
  }

  const {
    bId,
    result,
  } = payload;

  if (!Array.isArray(result)) {
    return errors.tkmf;
  }
  if (!reg.test(bId)) {
    return errors.ntfd;
  }

  try {
    const doc = await Ballot.findById(bId);
    if (!doc) {
      return errors.ntfd;
    }
    logger.trace('Old ballot', doc);
    if (doc.status !== 'voting') {
      return errors.stna;
    }
    if (doc.fields.length !== result.length) {
      return errors.rsmf;
    }
    if (doc.voters.length !== s.length) {
      return errors.tkmf;
    }
    if (doc.voters.length !== c.length) {
      return errors.tkmf;
    }
    const fldOk = _.zipWith(doc.fields, result, (f, r) => {
      if (typeof r !== 'string') {
        return false;
      }
      switch (f.type) {
        case 'enum':
          return f.data.includes(r);
        case 'string':
          return r.length > 0;
        default:
          return false;
      }
    }).every((v) => v);
    if (!fldOk) {
      return errors.rsmf;
    }

    logger.debug('Format correct, generated ticket');
    const tId = await tIdGen();
    const ticket = new SubmittedTicket();
    ticket._id = tId;
    ticket.ticket = {
      _id: t,
      payload: {
        bId,
        result,
      },
      s,
      c,
    };
    ticket.status = 'submitted';
    await ticket.save();
    logger.debug('Submitted ticket saved', tId);
    await verify(doc, ticket);
    logger.info('Ticket submitted', tId);
    return {
      status: 202,
      json: { tId },
    };
  } catch (e) {
    logger.error('Submit ticket', e);
    return {
      status: 500,
      json: { error: { code: 'xxxx', message: e.message } },
    };
  }
};

// eslint-disable-next-line
const checkTicket = async (tId) => {
  const reg = /^([a-z0-9][a-z0-9])+$/;

  if (!reg.test(tId)) {
    return errors.ntfd;
  }

  try {
    const doc = await SubmittedTicket.findById(tId);
    if (!doc) {
      return errors.ntfd;
    }
    logger.trace('Old ticket', doc);
    switch (doc.status) {
      case 'submitted':
        return {
          status: 202,
        };
      case 'accepted':
        return {
          status: 204,
        };
      case 'declined':
        return errors.xsgn;
      case 'timeout':
        return errors.stna;
      default:
        logger.error('Invalid status', doc.status);
        return {
          status: 500,
          json: { error: { code: 'xxxx', message: 'Invalid status' } },
        };
    }
  } catch (e) {
    logger.error('Submit ticket', e);
    return {
      status: 500,
      json: { error: { code: 'xxxx', message: e.message } },
    };
  }
};

module.exports = {
  errors,
  submitTicket,
  checkTicket,
};
