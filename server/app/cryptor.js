const stringify = require('json-stringify-deterministic');
const rpc = require('../rpc');
const logger = require('../logger')('cryptor');

const handler = (err, res, con) => {
  if (err) {
    logger.warn('Errored message from P', err);
  }
  // TODO
  logger.info('RES', res);
  logger.info('CON', con);
};

rpc.onPMessage(handler);

module.exports = {
  handler,

  async argon2i(password, salt) {
    return rpc.call('argon2i', {
      password,
      salt,
    });
  },

  newRing(ballot) {
    const { _id } = ballot;
    rpc.publish('newRing', undefined, {
      _id,
    });
  },

  async genH(ballot) {
    const { q, g } = ballot;
    const publicKeys = ballot.voters.map((v) => v.publicKey);
    return rpc.call('genH', {
      q,
      g,
      publicKeys,
    });
  },

  async verify(ballot, signedTicket) {
    const { q, g, h } = ballot;
    const publicKeys = ballot.voters.map((v) => v.publicKey);
    const { t, s, c } = signedTicket;
    const payload = stringify(signedTicket.payload);
    const res = await rpc.call('verify', {
      q,
      g,
      h,
      publicKeys,
      t,
      payload,
      s,
      c,
    });
    return res.valid === 1;
  },
};
