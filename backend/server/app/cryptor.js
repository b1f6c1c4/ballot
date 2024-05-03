const stringify = require('json-stable-stringify');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rpc = require('../rpc');
const finalizeNewRing = require('./newRing');
const finalizeVerify = require('./verify');
const logger = require('../logger')('cryptor');

const handler = (err, res, con) => {
  logger.trace('CON', con);
  logger.trace('RES', res);
  if (err) {
    logger.error('Errored message from P', err);
    return;
  }
  switch (con.method) {
    case 'newRing':
      finalizeNewRing(res, con);
      break;
    case 'verify':
      finalizeVerify(res, con);
      break;
    default:
      logger.error('Method not found form P', con.method);
      break;
  }
};

rpc.onPMessage(handler);

const idGen = (len) => () => new Promise((resolve, reject) => {
  crypto.randomBytes(len, (err, buf) => {
    if (err) {
      reject(err);
    } else {
      resolve(buf.toString('hex'));
    }
  });
});

module.exports = {
  handler,

  idGen,
  bIdGen: idGen(32),
  iCodeGen: idGen(32),
  tIdGen: idGen(32),

  async hashPassword(password) {
    return bcrypt.hash(password, 14)
  },

  async verifyPassword(password, hash) {
    return { valid: await bcrypt.compare(password, hash) };
  },

  async newRing(ballot) {
    const { _id } = ballot;
    await rpc.publish('newRing', undefined, {
      reply: {
        method: 'newRing',
        _id,
      },
    });
  },

  async genH(ballot) {
    const { q, g } = ballot.crypto;
    const publicKeys = ballot.voters.map((v) => v.publicKey);
    return rpc.call('genH', {
      q,
      g,
      publicKeys,
    });
  },

  async verify(ballot, submittedTicket) {
    const { q, g, h } = ballot.crypto;
    const publicKeys = ballot.voters.map((v) => v.publicKey);
    const { _id, ticket } = submittedTicket;
    const { s, c } = ticket;
    const payload = stringify(ticket.payload);
    await rpc.publish('verify', {
      q,
      g,
      h,
      publicKeys,
      t: ticket._id,
      payload,
      s,
      c,
    }, {
      reply: {
        method: 'verify',
        _id,
        bId: ballot._id,
      },
    });
  },
};
