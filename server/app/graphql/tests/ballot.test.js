const { Ballot } = require('../../../models/ballots');
const errors = require('../error');
const { throwBallot } = require('../../../tests/util');

jest.doMock('../../cryptor', () => ({
  bIdGen: () => 'bbb',
  iCodeGen: () => 'icc',
  newRing(doc) {
    expect(doc).toBeInstanceOf(Ballot);
    expect(doc._id).toEqual('bbb');
  },
}));

jest.mock('../../auth', () => ({
  issue: (payload) => payload,
}));

// eslint-disable-next-line global-require
const { resolvers } = require('../ballot');

const {
  createBallot,
  replaceFields,
  createVoter,
  deleteVoter,
} = resolvers.Mutation;

describe('Mutation', () => {
  describe('createBallot', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(createBallot(undefined, {
        input: {
          name: 'a',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });

    it('should throw name malformed', () => {
      expect.hasAssertions();
      return expect(createBallot(undefined, {
        input: {
          name: '',
        },
      }, {
        auth: { username: 'asdfqwer' },
      })).resolves.toBeInstanceOf(errors.NameMalformedError);
    });

    it('should not throw if error', async (done) => {
      throwBallot({
        save: new Error('Some error'),
      });
      expect.hasAssertions();
      const res = await createBallot(undefined, {
        input: {
          name: 'nm',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should save if good', async (done) => {
      expect.hasAssertions();
      const res = await createBallot(undefined, {
        input: {
          name: 'nm',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(Ballot);
      expect(res._id).toEqual('bbb');
      const doc = await Ballot.findById('bbb');
      expect(doc._id).toEqual('bbb');
      expect(doc.name).toEqual('nm');
      expect(doc.owner).toEqual('asdfqwer');
      expect(doc.status).toEqual('creating');
      expect(doc.fields.length).toEqual(0);
      expect(doc.voters.length).toEqual(0);
      done();
    });
  });

  describe('replaceFields', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [],
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });

    it('should throw field type both malformed', () => {
      expect.hasAssertions();
      return expect(replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [{
            prompt: '',
            stringDefault: 'sd',
            enumItems: ['it'],
          }],
        },
      }, {
        auth: { username: 'asdfqwer' },
      })).resolves.toBeInstanceOf(errors.FieldMalformedError);
    });

    it('should throw field type neither malformed', () => {
      expect.hasAssertions();
      return expect(replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [{
            prompt: '',
          }],
        },
      }, {
        auth: { username: 'asdfqwer' },
      })).resolves.toBeInstanceOf(errors.FieldMalformedError);
    });

    it('should not throw if error', async (done) => {
      throwBallot({
        findOne: new Error('Some error'),
      });
      expect.hasAssertions();
      const res = await replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [],
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should throw unauthorized if not owner', async (done) => {
      let doc = new Ballot();
      doc._id = '123';
      doc.owner = 'own';
      doc.fields = [{
        prompt: 'a',
        type: 't',
        data: ['d'],
      }];
      await doc.save();
      expect.hasAssertions();
      const res = await replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [],
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      doc = await Ballot.findById('123');
      expect(doc.fields.toObject()).toEqual([{
        prompt: 'a',
        type: 't',
        data: ['d'],
      }]);
      done();
    });

    it('should handle not found', async (done) => {
      expect.hasAssertions();
      const res = await replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [],
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should handle status incorrect', async (done) => {
      let doc = new Ballot();
      doc._id = '123';
      doc.owner = 'asdfqwer';
      doc.status = 'unknown';
      doc.fields = [{
        prompt: 'a',
        type: 't',
        data: ['d'],
      }];
      await doc.save();
      expect.hasAssertions();
      const res = await replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [],
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.StatusNotAllowedError);
      doc = await Ballot.findById('123');
      expect(doc.fields.toObject()).toEqual([{
        prompt: 'a',
        type: 't',
        data: ['d'],
      }]);
      done();
    });

    it('should save if good', async (done) => {
      let doc = new Ballot();
      doc._id = '123';
      doc.owner = 'asdfqwer';
      doc.status = 'invited';
      doc.fields = [{
        prompt: 'a',
        type: 't',
        data: ['d'],
      }];
      await doc.save();
      expect.hasAssertions();
      const res = await replaceFields(undefined, {
        input: {
          bId: '123',
          fields: [
            { prompt: '1', stringDefault: 'sd' },
            { prompt: '2', enumItems: ['it', 'its'] },
          ],
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toEqual([
        { prompt: '1', type: 'string', data: ['sd'] },
        { prompt: '2', type: 'enum', data: ['it', 'its'] },
      ]);
      doc = await Ballot.findById('123');
      expect(doc.fields.toObject()).toEqual([
        { prompt: '1', type: 'string', data: ['sd'] },
        { prompt: '2', type: 'enum', data: ['it', 'its'] },
      ]);
      done();
    });
  });

  describe('createVoter', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(createVoter(undefined, {
        input: {
          bId: '123',
          name: 'nm',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });

    it('should throw name malformed', () => {
      expect.hasAssertions();
      return expect(createVoter(undefined, {
        input: {
          bId: '123',
          name: '',
        },
      }, {
        auth: { username: 'asdfqwer' },
      })).resolves.toBeInstanceOf(errors.NameMalformedError);
    });

    it('should not throw if error', async (done) => {
      throwBallot({
        findOne: new Error('Some error'),
      });
      expect.hasAssertions();
      const res = await createVoter(undefined, {
        input: {
          bId: '123',
          name: 'nm',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should throw unauthorized if not owner', async (done) => {
      const doc = new Ballot();
      doc._id = '123';
      doc.owner = 'own';
      await doc.save();
      expect.hasAssertions();
      const res = await createVoter(undefined, {
        input: {
          bId: '123',
          name: 'nm',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should handle not found', async (done) => {
      expect.hasAssertions();
      const res = await createVoter(undefined, {
        input: {
          bId: '123',
          name: 'nm',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should handle status incorrect', async (done) => {
      let doc = new Ballot();
      doc._id = '123';
      doc.owner = 'asdfqwer';
      doc.status = 'unknown';
      doc.voters = [
        { _id: 'ic', name: 'n' },
      ];
      await doc.save();
      expect.hasAssertions();
      const res = await createVoter(undefined, {
        input: {
          bId: '123',
          name: 'nm',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.StatusNotAllowedError);
      doc = await Ballot.findById('123');
      expect(doc.voters.toObject()).toEqual([
        { _id: 'ic', name: 'n' },
      ]);
      done();
    });

    it('should save if good', async (done) => {
      let doc = new Ballot();
      doc._id = '123';
      doc.owner = 'asdfqwer';
      doc.status = 'inviting';
      doc.voters = [
        { _id: 'ic', name: 'n' },
      ];
      await doc.save();
      expect.hasAssertions();
      const res = await createVoter(undefined, {
        input: {
          bId: '123',
          name: 'nm',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res._id).toEqual('icc');
      expect(res.name).toEqual('nm');
      doc = await Ballot.findById('123');
      expect(doc.voters.toObject()).toEqual([
        { _id: 'ic', name: 'n' },
        { _id: 'icc', name: 'nm' },
      ]);
      done();
    });
  });

  describe('deleteVoter', () => {
    it('should throw unauthorized', () => {
      expect.hasAssertions();
      return expect(deleteVoter(undefined, {
        input: {
          bId: '123',
          iCode: 'ic',
        },
      }, undefined)).resolves.toBeInstanceOf(errors.UnauthorizedError);
    });

    it('should not throw if error', async (done) => {
      throwBallot({
        findOne: new Error('Some error'),
      });
      expect.hasAssertions();
      const res = await deleteVoter(undefined, {
        input: {
          bId: '123',
          iCode: 'ic',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Some error');
      done();
    });

    it('should throw unauthorized if not owner', async (done) => {
      const doc = new Ballot();
      doc._id = '123';
      doc.owner = 'own';
      await doc.save();
      expect.hasAssertions();
      const res = await deleteVoter(undefined, {
        input: {
          bId: '123',
          iCode: 'ic',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.UnauthorizedError);
      done();
    });

    it('should handle ballot not found', async (done) => {
      expect.hasAssertions();
      const res = await deleteVoter(undefined, {
        input: {
          bId: '123',
          iCode: 'ic',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.NotFoundError);
      done();
    });

    it('should handle voter not found', async (done) => {
      let doc = new Ballot();
      doc._id = '123';
      doc.owner = 'asdfqwer';
      doc.status = 'inviting';
      doc.voters = [
        { _id: 'ic', name: 'n' },
      ];
      await doc.save();
      expect.hasAssertions();
      const res = await deleteVoter(undefined, {
        input: {
          bId: '123',
          iCode: 'icc',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.NotFoundError);
      doc = await Ballot.findById('123');
      expect(doc.voters.toObject()).toEqual([
        { _id: 'ic', name: 'n' },
      ]);
      done();
    });

    it('should handle status incorrect', async (done) => {
      let doc = new Ballot();
      doc._id = '123';
      doc.owner = 'asdfqwer';
      doc.status = 'unknown';
      doc.voters = [
        { _id: 'ic', name: 'n' },
      ];
      await doc.save();
      expect.hasAssertions();
      const res = await deleteVoter(undefined, {
        input: {
          bId: '123',
          iCode: 'ic',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toBeInstanceOf(errors.StatusNotAllowedError);
      doc = await Ballot.findById('123');
      expect(doc.voters.toObject()).toEqual([
        { _id: 'ic', name: 'n' },
      ]);
      done();
    });

    it('should save if good', async (done) => {
      let doc = new Ballot();
      doc._id = '123';
      doc.owner = 'asdfqwer';
      doc.status = 'inviting';
      doc.voters = [
        { _id: 'ic', name: 'n' },
        { _id: 'icc', name: 'nm' },
      ];
      await doc.save();
      expect.hasAssertions();
      const res = await deleteVoter(undefined, {
        input: {
          bId: '123',
          iCode: 'icc',
        },
      }, {
        auth: { username: 'asdfqwer' },
      });
      expect(res).toEqual(true);
      doc = await Ballot.findById('123');
      expect(doc.voters.toObject()).toEqual([
        { _id: 'ic', name: 'n' },
      ]);
      done();
    });
  });
});
