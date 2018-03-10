import _ from 'lodash';
import bigInt from 'big-integer';
import {
  generateKeyPair,
  signMessage,
} from '../core';

let counter = 123;
bigInt.randBetween = () => {
  counter += 1;
  return bigInt(counter);
};

describe('generateKeyPair', () => {
  const param = {
    q: '3ab23329af',
    g: '05',
  };

  it('should match snapshot', async (done) => {
    const result = await generateKeyPair(undefined, param);
    expect(result).toMatchSnapshot();
    done();
  });
});

describe('signMessage', () => {
  const param = {
    q: '3ab23329af',
    g: '05',
    h: '31845ad925',
    x: 'b00b',
    ys: [
      '2711012471',
      'ababcdcd',
      'efefcdcd',
      '23145315',
    ],
  };

  it('should match snapshot', async (done) => {
    let pg;
    const progress = (v) => { pg = v; };
    const result = await signMessage(progress, { key: 'val' }, param);
    expect(result).toMatchSnapshot();
    expect(pg).toEqual(1);
    done();
  });

  it('should throw nopk', async (done) => {
    try {
      await signMessage(undefined, { key: 'val' }, _.merge({}, param, { x: '123' }));
      expect(undefined).toBeDefined();
      done();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      done();
    }
  });

  it('should throw rpic', async (done) => {
    try {
      await signMessage(undefined, { key: 'val' }, _.merge({}, param, { h: '1234' }));
      expect(undefined).toBeDefined();
      done();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      done();
    }
  });
});
