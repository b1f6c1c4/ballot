const stringify = require('json-stable-stringify');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const finalizeNewRing = require('./newRing');
const finalizeVerify = require('./verify');
const cryptor = require('../cryptor.node');
const logger = require('../logger')('cryptor');

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
  idGen,
  bIdGen: idGen(32),
  iCodeGen: idGen(32),
  tIdGen: idGen(32),

  async hashPassword(password) {
    logger.info('Method hashPassword called');
    return { hash: await bcrypt.hash(password, 14) };
  },

  async verifyPassword(password, hash) {
    logger.info('Method verifyPassword called');
    return { valid: await bcrypt.compare(password, hash) };
  },

  newRing(ballot) {
    logger.info('Method newRing called');
    const { _id } = ballot;
    const dt = new Date();
    cryptor.newRing((res) => {
      logger.info('Method newRing finished: duration is', new Date() - dt);
      finalizeNewRing(JSON.parse(res), { _id });
    });
  },

  genH: (ballot) => new Promise((resolve, reject) => {
    logger.info('Method genH called');
    const { q, g } = ballot.crypto;
    const publicKeys = ballot.voters.map((v) => v.publicKey);
    const dt = new Date();
    JSON.parse(cryptor.genH(JSON.stringify({ q, g, publicKeys }), (res) => {
      logger.info('Method genH finished: duration is', new Date() - dt);
      if (res) {
        resolve(JSON.parse(res));
      } else {
        reject(new Error('genH'));
      }
    }));
  }),

  verify(ballot, submittedTicket) {
    logger.info('Method verify called');
    const { _id: bId, crypto: { q, g, h } } = ballot;
    const publicKeys = ballot.voters.map((v) => v.publicKey);
    const { _id, ticket } = submittedTicket;
    const { _id: t, s, c } = ticket;
    const payload = stringify(ticket.payload);
    const dt = new Date();
    cryptor.verify(JSON.stringify({ q, g, h, publicKeys, t, payload, s, c }), (valid) => {
      logger.info('Method verify finished: duration is', new Date() - dt);
      finalizeVerify({ valid }, { _id, bId });
    });
  },
};
