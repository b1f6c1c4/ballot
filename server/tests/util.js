const _ = require('lodash');
const { connect } = require('../mongo');
const { Organizer } = require('../models/organizers');
const { Ballot } = require('../models/ballots');
const { SubmittedTicket } = require('../models/submittedTickets');
const { SignedTicket } = require('../models/signedTickets');
const thrower = require('./mongooseThrower');
const logger = require('../logger')('tests/util');

const models = {
  Organizer,
  Ballot,
  SubmittedTicket,
  SignedTicket,
};

_.mapValues(models, (M) => {
  /* eslint-disable no-param-reassign */
  logger.info('Injecting model', M.modelName);
  M.thrower = thrower(M);
  M.checkOn = (verb) => M.thrower({
    [verb]: false,
  });
  M.throwErrOn = (verb) => M.thrower({
    [verb]: new Error('Some error'),
  });
  /* eslint-enable no-param-reassign */
});

const clearThrowers = () => {
  _.mapValues(models, (M) => M.thrower({}));
};

const clearDocuments =
  () => Promise.all(_.values(models).map((M) => M.remove()));

beforeAll(async (done) => {
  logger.info('Connecting mongoose');
  await connect();
  done();
});

beforeEach(async (done) => {
  expect.hasAssertions();
  await clearDocuments();
  clearThrowers();
  done();
});

afterAll(async (done) => {
  await clearDocuments();
  done();
});

const superMerge = (base, objs) => {
  for (let i = 0; i < objs.length;) {
    const o = objs[i];
    if (typeof o === 'string') {
      const target = i < objs.length - 1 ? objs[i + 1] : undefined;
      _.set(base, o, target);
      i += 2;
    } else if (typeof o === 'object') {
      _.assignIn(base, _.cloneDeep(o));
      i += 1;
    } else {
      logger.error('Super merge', o);
      i += 1;
    }
  }
  return base;
};

const make = _.mapValues(models, (M) => async (...os) => {
  const doc = new M();
  doc.set(superMerge({}, os));
  await doc.save();
  return doc.toObject();
});

const check = _.mapValues(models, (M) => async (...os) => {
  const docs = await M.find({});
  if (os.length === 0) {
    expect(docs.length).toEqual(0);
  } else {
    const o = superMerge({}, os);
    expect(docs.length).toEqual(1);
    const ox = docs[0].toObject();
    delete ox.__v;
    delete ox.createdAt;
    delete ox.updatedAt;
    expect(ox).toEqual(o);
  }
});

module.exports = {
  superMerge,
  models,
  mer: (base, ...os) => superMerge(Array.isArray(base) ? [] : {}, [base, ...os]),
  make,
  check,
};
