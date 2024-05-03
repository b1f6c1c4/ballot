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
  handler,

  idGen,
  bIdGen: idGen(32),
  iCodeGen: idGen(32),
  tIdGen: idGen(32),

  async hashPassword(password) {
    return bcrypt.hash(password, 14);
  },

  async verifyPassword(password, hash) {
    return { valid: await bcrypt.compare(password, hash) };
  },

  async newRing(ballot) {
    const { _id } = ballot;
    finalizeNewRing(cryptor.newRing(), { _id });
  },

  async genH(ballot) {
    const { q, g } = ballot.crypto;
    const publicKeys = ballot.voters.map((v) => v.publicKey);
    return cryptor.genH({ q, g, publicKeys });
  },

  async verify(ballot, submittedTicket) {
    const { _id: bId, crypto: { q, g, h } } = ballot;
    const publicKeys = ballot.voters.map((v) => v.publicKey);
    const { _id, ticket: { _id: t } } = submittedTicket;
    const { s, c } = ticket;
    const payload = stringify(ticket.payload);
    const valid = cryptor.verify({ q, g, h, publicKeys, t, payload, s, c });
    finalizeVerify({ valid }, { _id, bId });
  },
};
