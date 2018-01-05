const redirect = require('../redirect');

describe('redirect', () => {
  const res = {
    redirect: jest.fn(),
  };
  const reqBuilder = (host) => ({
    get: (str) => {
      expect(str).toEqual('host');
      return host;
    },
    originalUrl: '/the-url',
  });
  beforeEach(() => {
    process.env.REDIRECT_URL = 'the-try-react-url';
    res.redirect.mockReset();
  });

  it('should redirect to production url when no staging', () => {
    redirect(reqBuilder('try-react-host'), res);
    expect(res.redirect).toHaveBeenCalled();
    expect(res.redirect.mock.calls.length).toEqual(1);
    expect(res.redirect.mock.calls[0][0]).toEqual(301);
    expect(res.redirect.mock.calls[0][1]).toEqual('the-try-react-url/the-url');
  });

  it('should redirect to staging url when staging', () => {
    redirect(reqBuilder('try-react-staging-host'), res);
    expect(res.redirect).toHaveBeenCalled();
    expect(res.redirect.mock.calls.length).toEqual(1);
    expect(res.redirect.mock.calls[0][0]).toEqual(301);
    expect(res.redirect.mock.calls[0][1]).toEqual('the-try-react-staging-url/the-url');
  });
});
