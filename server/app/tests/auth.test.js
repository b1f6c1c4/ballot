const { TryJWTStrategy, issue } = require('../auth');

TryJWTStrategy.prototype.success = jest.fn();
TryJWTStrategy.prototype.error = jest.fn();

describe('auth', () => {
  const strategy = new TryJWTStrategy();

  beforeEach(() => {
    TryJWTStrategy.prototype.success.mockReset();
    TryJWTStrategy.prototype.error.mockReset();
  });

  it('should not auth no header', () => {
    const req = {
      headers: {
        data: 'value',
      },
    };
    strategy.authenticate(req);
    expect(TryJWTStrategy.prototype.error.mock.calls.length).toBe(0);
    expect(TryJWTStrategy.prototype.success.mock.calls.length).toBe(1);
    expect(TryJWTStrategy.prototype.success.mock.calls[0][0]).toBeNull();
  });

  it('should not auth malformed header', () => {
    const req = {
      headers: {
        authentication: 'value',
      },
    };
    strategy.authenticate(req);
    expect(TryJWTStrategy.prototype.error.mock.calls.length).toBe(0);
    expect(TryJWTStrategy.prototype.success.mock.calls.length).toBe(1);
    expect(TryJWTStrategy.prototype.success.mock.calls[0][0].error).toBe('hhmf');
  });

  it('should not auth invalid jwt', () => {
    const req = {
      headers: {
        authentication: 'bearer ae0751uj94.98ncf9q34.dfncq249-_z-afer',
      },
    };
    strategy.authenticate(req);
    expect(TryJWTStrategy.prototype.error.mock.calls.length).toBe(0);
    expect(TryJWTStrategy.prototype.success.mock.calls.length).toBe(1);
    expect(TryJWTStrategy.prototype.success.mock.calls[0][0].error).toBeDefined();
  });

  it('should auth issued jwt (bearer) successfully', () => {
    const payload = {
      data: 'value',
    };

    const jwt = issue(payload);
    expect(jwt).toEqual(expect.stringMatching(/^[a-zA-Z0-9+/=]+\.[a-zA-Z0-9+/=]+\.[-_a-zA-Z0-9+/=]+$/));

    const req = {
      headers: {
        authentication: `bearer ${jwt}`,
      },
    };
    strategy.authenticate(req);
    expect(TryJWTStrategy.prototype.error.mock.calls.length).toBe(0);
    expect(TryJWTStrategy.prototype.success.mock.calls.length).toBe(1);
    const user = TryJWTStrategy.prototype.success.mock.calls[0][0];
    Object.keys(payload).forEach((k) => {
      expect(user[k]).toEqual(payload[k]);
    });
  });

  it('should auth issued jwt (JWT) successfully', () => {
    const payload = {
      data: 'value',
    };

    const jwt = issue(payload);
    expect(jwt).toEqual(expect.stringMatching(/^[a-zA-Z0-9+/=]+\.[a-zA-Z0-9+/=]+\.[-_a-zA-Z0-9+/=]+$/));

    const req = {
      headers: {
        authentication: `JWT ${jwt}`,
      },
    };
    strategy.authenticate(req);
    expect(TryJWTStrategy.prototype.error.mock.calls.length).toBe(0);
    expect(TryJWTStrategy.prototype.success.mock.calls.length).toBe(1);
    const user = TryJWTStrategy.prototype.success.mock.calls[0][0];
    Object.keys(payload).forEach((k) => {
      expect(user[k]).toEqual(payload[k]);
    });
  });
});
