import bigInt from 'big-integer';
import { sha3_512 as sha3 } from 'js-sha3';
import stringify from 'json-stringify-deterministic';

const parse = (str) => bigInt(str, 16);
const toStr = (val) => val.toString(16).padStart('0', 2048 / 4);
const toBuf = (val) => Buffer.from(toStr(val), 'hex');

export const generateKeyPair = (param) => {
  const q = parse(param.q);
  const g = parse(param.g);

  const x = bigInt.randBetween(q.shiftRight(4), q);
  const y = g.modPow(x, q);

  return {
    privateKey: toStr(x),
    publicKey: toStr(y),
  };
};

export const signMessage = (payload, param) => {
  const q = parse(param.q);
  const g = parse(param.g);
  const h = parse(param.h);
  const x = parse(param.x);
  const ys = param.ys.map(parse);

  const y0 = g.modPow(x, q);
  const k = ys.findIndex((y) => y.equals(y0));
  if (k === -1) {
    const e = new Error('No public key');
    e.codes = ['nopk'];
    throw e;
  }

  const h2 = sha3.create();
  ys.forEach((y) => h2.update(toBuf(y)));
  const hVerify = parse(h2.hex());
  if (!h.equals(hVerify)) {
    const e = new Error('Ring parameter incorrect');
    e.codes = ['rpic'];
    throw e;
  }

  return undefined;
};
