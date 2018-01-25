import { makeApi } from '../request';

describe('request', () => {
  describe('makeApi', () => {
    it('should return default', () => {
      process.env.API_URL = '';
      expect(makeApi('val')).toBe('/apival');
    });

    it('should return default', () => {
      process.env.API_URL = 'sth';
      expect(makeApi('val')).toBe('sthval');
    });
  });
});
