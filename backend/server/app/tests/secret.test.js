// const mockingoose = require('mockingoose').default;
const {
  errors,
  submitTicket,
  checkTicket,
} = require('../secret');

describe('submitTicket', () => {
  it('should malform extra field', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
      key: null,
    })).resolves.toBe(errors.tkmf);
  });
  it('should malform extra payload', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
        key: null,
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.tkmf);
  });
  it('should malform t', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.tkmf);
  });
  it('should malform bId', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cD',
        result: ['a', 'b'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.xbid);
  });
  it('should malform result', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: {},
      },
      s: ['56ef', '78ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.tkmf);
  });
  it('should malform s', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
      },
      s: ['56ef', '78Ab'],
      c: ['90cd', '12ef'],
    })).resolves.toBe(errors.tkmf);
  });
  it('should malform c', () => {
    expect.hasAssertions();
    return expect(submitTicket({
      t: '12ab',
      payload: {
        bId: '34cd',
        result: ['a', 'b'],
      },
      s: ['56ef', '78ab'],
      c: ['90cd', undefined, '12ef'],
    })).resolves.toBe(errors.tkmf);
  });
  // TODO
});

describe('checkTicket', () => {
  it('should malform tId', () => {
    expect.hasAssertions();
    return expect(checkTicket('123')).resolves.toBe(errors.ntfd);
  });
});
