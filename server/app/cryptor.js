const stringify = require('json-stringify-deterministic');
const crypto = require('crypto');
const Ballot = require('../models/ballots');
const rpc = require('../rpc');
const logger = require('../logger')('cryptor');

const handler = (err, res, con) => {
  logger.trace('CON', con);
  logger.trace('RES', res);
  if (err) {
    logger.error('Errored message from P', err);
    return;
  }
  switch (con.method) {
    case 'newRing': {
      const { _id } = con;
      const { q, g } = res;
      logger.debug('Finalize newRing...', _id);
      Ballot.findOneAndUpdate({
        _id,
        status: 'creating',
      }, {
        $inc: {
          __v: 1,
        },
        $set: {
          status: 'inviting',
          crypto: { q, g },
        },
      }, {
        upsert: false,
      }, (e) => {
        if (e) {
          logger.error('Finalize newRing', e);
        } else {
          logger.info('Crypto param created', _id);
        }
      });
      break;
    }
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

  async argon2i(password, salt) {
    return rpc.call('argon2i', {
      password,
      salt,
    });
  },

  newRing(ballot) {
    const { _id } = ballot;
    rpc.publish('newRing', undefined, {
      reply: {
        method: 'newRing',
        _id,
      },
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
