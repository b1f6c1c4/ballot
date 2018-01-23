const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const anony = require('./anonymity');
const Ballot = require('../models/ballots');
const SubmittedTicket = require('../models/submittedTickets');
const { tIdGen } = require('./cryptor');
const logger = require('../logger')('secret');

const router = express.Router();

const errors = {
  ntfd: {
    status: 404,
    json: { error: { code: 'ntfd', message: 'Not Found' } },
  },
  tkmf: {
    status: 400,
    json: { error: { code: 'tkmf', message: 'Ticket malformed' } },
  },
  rsmf: {
    status: 400,
    json: { error: { code: 'rsmf', message: '`payload.result` malformed' } },
  },
  xbid: {
    status: 404,
    json: { error: { code: 'xbid', message: '`payload.bId` non-exist' } },
  },
  nvtg: {
    status: 409,
    json: { error: { code: 'nvtg', message: 'Ballot status is not `voting`' } },
  },
  xsgn: {
    status: 401,
    json: { error: { code: 'xsgn', message: 'Invalid signature' } },
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

  if (!reg.test(bId)) {
    return errors.xbid;
  }
  if (!Array.isArray(result)) {
    return errors.tkmf;
  }

  try {
    const doc = await Ballot.findById(bId);
    if (!doc) {
      return errors.xbid;
    }
    logger.trace('Old ballot', doc);
    if (doc.status !== 'voting') {
      return errors.nvtg;
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
      case 'decline':
        return errors.xsgn;
      case 'timeout':
        return errors.nvtg;
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

router.use(anony(), bodyParser.urlencoded({
  extended: false,
}));

router.post('/tickets', async (req, res, next) => {
  logger.trace('POST /tickets');
  logger.trace('Anony', req.anony);
  try {
    switch (req.accepts(['json', 'html'])) {
      case 'json': {
        logger.debug('Requesting json');
        const rst = await submitTicket(req.body);
        logger.debug('Resposne status', rst.status);
        res.status(rst.status).json(rst.json);
        return;
      }
      case 'html': {
        logger.debug('Requesting html');
        const buf = Buffer.from(req.body.enc, 'base64');
        const j = JSON.stringify(buf.toString('utf8'));
        logger.trace('Parsing base64 succeed');
        const rst = await submitTicket(j);
        logger.debug('Resposne status', rst.status);
        if (rst.status === 202) {
          res.status(rst.status).send(`Ticket staged. Your tId is <pre>${rst.json.tId}</pre>`);
        } else {
          res.status(rst.status).send(`Error occured: <pre>${rst.json.error}</pre>`);
        }
        return;
      }
      default:
        res.status(406).send();
    }
  } catch (e) {
    next(e);
  }
});

router.get('/tickets/', async (req, res, next) => {
  logger.trace('GET /tickets/?tId=', req.query.tId);
  logger.trace('Anony', req.anony);
  try {
    switch (req.accepts(['json', 'html'])) {
      case 'json': {
        logger.debug('Requesting json');
        const rst = await checkTicket(req.query.tId);
        logger.debug('Resposne status', rst.status);
        res.status(rst.status).json(rst.json);
        return;
      }
      case 'html': {
        logger.debug('Requesting html');
        const rst = await checkTicket(req.query.tId);
        logger.debug('Resposne status', rst.status);
        if (rst.status === 202) {
          res.status(rst.status).send('Still processing.');
        } else if (rst.status === 200) {
          res.status(rst.status).send('Success.');
        } else {
          res.status(rst.status).send(`Error occured: <pre>${rst.json.error}</pre>`);
        }
        return;
      }
      default:
        res.status(406).send();
    }
  } catch (e) {
    next(e);
  }
});

module.exports = {
  errors,
  submitTicket,
  checkTicket,
  default: router,
};
