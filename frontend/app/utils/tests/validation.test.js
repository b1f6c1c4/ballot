import * as validation from '../validation';

jest.mock('utils/messages', () => ({
  required: 'req',
  minChar: 'min',
  alphanumericDash: 'and',
  noEmptyLines: 'nel',
  noDupLines: 'ndl',
}));

describe('required', () => {
  const func = validation.required();

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
  const func = validation.minChar(3);

  it('should allow', () => {
    expect(func('sdf')).toBeUndefined();
  });

  it('should not allow', () => {
    expect(func('vv')).toEqual(['min', { m: 3 }]);
  });
});

describe('alphanumericDash', () => {
  const func = validation.alphanumericDash();

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

describe('properLiens', () => {
  const func = validation.properLines();

  it('should allow', () => {
    expect(func('a\nb\nccc')).toBeUndefined();
  });

  it('should not allow empty', () => {
    expect(func('a\nb\n\nccc')).toEqual('nel');
  });

  it('should not allow final empty', () => {
    expect(func('a\nb\nccc\n')).toEqual('nel');
  });

  it('should not allow dup', () => {
    expect(func('a\nb\na')).toEqual('ndl');
  });
});

describe('hexChar', () => {
  const func = validation.hexChar();

  it('should allow', () => {
    expect(func('1BcDfa32121')).toBeUndefined();
  });

  it('should allow null', () => {
    expect(func(null)).toBeUndefined();
  });

  it('should allow undefined', () => {
    expect(func(undefined)).toBeUndefined();
  });

  it('should allow empty', () => {
    expect(func('')).toBeUndefined();
  });

  it('should not allow symbol', () => {
    expect(func('-')).toBeUndefined();
  });

  it('should not allow space', () => {
    expect(func('124 7af')).toBeUndefined();
  });

  it('should not allow non-hex alphabet', () => {
    expect(func('1bcdfa32g21')).toBeUndefined();
  });

  it('should not allow other', () => {
    expect(func('1bcdf\n32121')).toBeUndefined();
  });
});

describe('make', () => {
  const make = validation.default;
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
