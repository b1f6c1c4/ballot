jest.mock('tor-test', () => ({
  isTor(ip, cb) {
    if (ip === '1.2.3.4') {
      cb('value');
    } else if (ip === '2.3.4.5') {
      cb(undefined, true);
    } else {
      cb(undefined, false);
    }
  },
}));
// eslint-disable-next-line global-require
const anonymity = require('../anonymity');

describe('anonymity', () => {
  const res = (send) => ({
    status(code) {
      expect(code).toEqual(403);
      return {
        send,
      };
    },
  });
  const checkTor = (tor) => (req, good, allow, rawDone) => {
    const done = () => {
      if (req.ip === '1.2.3.4') {
        expect(req.anony.err).toEqual('value');
        expect(req.anony.isTor).toBeUndefined();
      } else {
        expect(req.anony.err).toBeUndefined();
        expect(req.anony.isTor).toEqual(req.ip === '2.3.4.5');
      }
      expect(req.anony.good).toEqual(good);
      rawDone();
    };
    tor(req, res(() => {
      expect(false).toEqual(allow);
      done();
    }), () => {
      expect(true).toEqual(allow);
      done();
    });
  };

  describe('forced (default)', () => {
    const check = checkTor(anonymity(undefined));

    it('should 403 if err', (done) => {
      check({
        ip: '1.2.3.4',
      }, false, false, done);
    });

    it('should 403 if not tor', (done) => {
      check({
        ip: '3.4.5.6',
      }, false, false, done);
    });

    it('should next if tor', (done) => {
      check({
        ip: '2.3.4.5',
      }, true, true, done);
    });
  });

  describe('not forced', () => {
    const check = checkTor(anonymity(false));

    it('should next if err', (done) => {
      check({
        ip: '1.2.3.4',
      }, false, true, done);
    });

    it('should next if not tor', (done) => {
      check({
        ip: '3.4.5.6',
      }, false, true, done);
    });

    it('should next if tor', (done) => {
      check({
        ip: '2.3.4.5',
      }, true, true, done);
    });
  });
});
