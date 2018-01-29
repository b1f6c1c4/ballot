jest.mock('messages', () => ({
  required: 'req',
  minChar: 'min',
  alphanumericDash: 'and',
}));

describe('required', () => {
  // eslint-disable-next-line global-require
  const func = require('../validation').required();

  it('should allow', () => {
    expect(func('asdf')).toBeUndefined();
  });

  it('should not allow empty', () => {
    expect(func('')).toEqual('req');
  });

  it('should not allow null', () => {
    expect(func(null)).toEqual('req');
  });

  it('should not allow undefined', () => {
    expect(func(undefined)).toEqual('req');
  });
});

describe('minChar', () => {
  // eslint-disable-next-line global-require
  const func = require('../validation').minChar(3);

  it('should allow', () => {
    expect(func('sdf')).toBeUndefined();
  });

  it('should not allow', () => {
    expect(func('vv')).toEqual(['min', { m: 3 }]);
  });
});

describe('alphanumericDash', () => {
  // eslint-disable-next-line global-require
  const func = require('../validation').alphanumericDash();

  it('should allow', () => {
    expect(func('-1s')).toBeUndefined();
  });

  it('should allow empty', () => {
    expect(func('')).toBeUndefined();
  });

  it('should not allow', () => {
    expect(func('\n')).toEqual('and');
  });
});

describe('make', () => {
  // eslint-disable-next-line global-require
  const make = require('../validation').default;
  const intl = { formatMessage: (...args) => args };

  it('should make allow', () => {
    const res = make(intl, (o) => {
      expect(o).toEqual('o');
      return undefined;
    });

    expect(res.length).toEqual(1);
    expect(res[0]('o')).toBeUndefined();
  });

  it('should make simple', () => {
    const res = make(intl, (o) => {
      expect(o).toEqual('o');
      return 'xx';
    });

    expect(res.length).toEqual(1);
    expect(res[0]('o')).toEqual(['xx']);
  });

  it('should make complex', () => {
    const res = make(intl, (o) => {
      expect(o).toEqual('o');
      return ['oo', 'xx'];
    });

    expect(res.length).toEqual(1);
    expect(res[0]('o')).toEqual(['oo', 'xx']);
  });
});