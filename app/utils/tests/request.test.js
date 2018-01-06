/**
 * Test the request function
 */

import { apiUrl, api } from '../request';

describe('request', () => {
  // Before each test, stub the fetch function
  beforeEach(() => {
    window.fetch = jest.fn();
  });

  describe('apiUrl', () => {
    it('should return default', () => {
      expect(apiUrl(undefined)).toBe('/api');
    });

    it('should return default', () => {
      expect(apiUrl('https://ballot-api.b1f6c1c4.info/api')).toBe('https://ballot-api.b1f6c1c4.info/api');
    });
  });

  describe('api', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('{"hello":"world"}', {
        status: 200,
        headers: {
          'Content-type': 'application/json',
        },
      });

      process.env.API_URL = 'the/api';
      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should forward method, url, auth, but not undefined JSON body', () => {
      api('METHOD', '/url', 'auth');
      expect(window.fetch.mock.calls.length).toBe(1);
      expect(window.fetch.mock.calls[0][0]).toBe('the/api/url');
      expect(window.fetch.mock.calls[0][1].method).toBe('METHOD');
      expect(window.fetch.mock.calls[0][1].headers.Authorization).toBe('auth');
      expect(window.fetch.mock.calls[0][1].headers['Content-Type']).toBeUndefined();
      expect(window.fetch.mock.calls[0][1].body).toBeUndefined();
    });

    it('should forward method, url, auth, but not null JSON body', () => {
      api('METHOD', '/url', 'auth', null);
      expect(window.fetch.mock.calls.length).toBe(1);
      expect(window.fetch.mock.calls[0][0]).toBe('the/api/url');
      expect(window.fetch.mock.calls[0][1].method).toBe('METHOD');
      expect(window.fetch.mock.calls[0][1].headers.Authorization).toBe('auth');
      expect(window.fetch.mock.calls[0][1].headers['Content-Type']).toBeUndefined();
      expect(window.fetch.mock.calls[0][1].body).toBeUndefined();
    });

    it('should forward method, url, auth, and non-null JSON body', () => {
      const json = { json: true };
      api('METHOD', '/url', 'auth', json);
      expect(window.fetch.mock.calls.length).toBe(1);
      expect(window.fetch.mock.calls[0][0]).toBe('the/api/url');
      expect(window.fetch.mock.calls[0][1].method).toBe('METHOD');
      expect(window.fetch.mock.calls[0][1].headers.Authorization).toBe('auth');
      expect(window.fetch.mock.calls[0][1].headers['Content-Type']).toBe('application/json');
      expect(window.fetch.mock.calls[0][1].body).toBe(JSON.stringify(json));
    });
  });

  describe('stubbing successful response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('{"hello":"world"}', {
        status: 200,
        headers: {
          'Content-type': 'application/json',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should format the response correctly', (done) => {
      api('METHOD', '/thisurliscorrect')
        .catch(done)
        .then((json) => {
          expect(json.hello).toBe('world');
          done();
        });
    });
  });

  describe('stubbing 204 response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('', {
        status: 204,
        statusText: 'No Content',
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should return null on 204 response', (done) => {
      api('METHOD', '/thisurliscorrect')
        .catch(done)
        .then((json) => {
          expect(json).toBeNull();
          done();
        });
    });
  });

  describe('stubbing error response', () => {
    // Before each test, pretend we got an unsuccessful response
    beforeEach(() => {
      const res = new Response('', {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-type': 'application/json',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should catch errors', (done) => {
      api('METHOD', '/thisdoesntexist')
        .catch((err) => {
          expect(err.response.status).toBe(404);
          expect(err.response.statusText).toBe('Not Found');
          done();
        });
    });
  });
});
