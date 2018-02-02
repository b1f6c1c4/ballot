import _ from 'lodash';
import bigInt from 'big-integer';
import { sha3_512 as sha3 } from 'js-sha3';
import stringify from 'json-stringify-deterministic';

const parse = (str) => bigInt(str, 16);
const toStr = (val) => val.toString(16).padStart(2048 / 4, '0');

export const random = (q) => bigInt.randBetween(q.shiftRight(4), q);

export const groupHash = async (param, ...vals) => {
  const { q, g } = param;

  const str = vals.map(toStr).join('');
  const h2 = sha3(Buffer.from(str, 'hex'));
  const h0 = parse(h2);

  return g.modPow(h0, q);
};

export const generateKeyPair = async (param) => {
  const q = parse(param.q);
  const g = parse(param.g);

  const x = random(q);
  const y = g.modPow(x, q);

  return {
    privateKey: toStr(x),
    publicKey: toStr(y),
  };
};

export const signMessage = async (payload, param) => {
  const q = parse(param.q);
  const qm1 = q.minus(bigInt.one);
  const g = parse(param.g);
  const h = parse(param.h);
  const x = parse(param.x);
  const n = param.ys.length;
  const ys = param.ys.map(parse);

  const y0 = g.modPow(x, q);
  const k = ys.findIndex((y) => y.equals(y0));
  if (k === -1) {
    const e = new Error('No public key');
    e.codes = ['nopk'];
    throw e;
  }

  const hVerify = await groupHash({ q, g }, ...ys);
  if (!h.equals(hVerify)) {
    const e = new Error('Ring parameter incorrect');
    e.codes = ['rpic'];
    throw e;
  }

  const t = h.modPow(x, q);
  const ss = Array.from({ length: n }, () => random(q));
  const cs = Array.from({ length: n }, () => random(q));
  const us = _.zip(ys, ss, cs).map(([y, s, c]) => g.modPow(s, q).multiply(y.modPow(c, q)).mod(q));
  const vs = _.zip(ss, cs).map(([s, c]) => h.modPow(s, q).multiply(t.modPow(c, q)).mod(q));
  us[k] = g.modPow(ss[k], q);
  vs[k] = h.modPow(ss[k], q);

  const rawS = ss.map(toStr);
  const rawC = cs.map(toStr);

  const pld = stringify(payload);
  const pldData = (new TextEncoder('utf-8')).encode(pld);
  const m = await groupHash({ q, g }, pldData);
  const h1 = await groupHash({ q, g }, m, t, ...us, ...vs);
  const sum = _.reduce(cs, (sm, c) => sm.add(c)).mod(qm1);
  cs[k] = cs[k].add(h1).add(qm1).minus(sum).mod(qm1);
  ss[k] = ss[k].add(qm1).minus(cs[k].multiply(x).mod(qm1)).mod(qm1);

  console.log(JSON.stringify({
    t: toStr(t),
    m: toStr(m),
    h1: toStr(h1),
    payload,
    rawS,
    rawC,
    s: ss.map(toStr),
    c: cs.map(toStr),
    u: us.map(toStr),
    v: vs.map(toStr),
  }, null, 2));

  return {
    t: toStr(t),
    payload,
    s: ss.map(toStr),
    c: cs.map(toStr),
  };
};
