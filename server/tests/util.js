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

const make = _.mapValues(models, (M) => async (...os) => {
  const doc = new M();
  os.forEach((o) => doc.set(o));
  await doc.save();
  return doc.toObject();
});

const check = _.mapValues(models, (M) => async (...os) => {
  const docs = await M.find({});
  if (os.length === 0) {
    expect(docs.length).toEqual(0);
  } else {
    const o = {};
    _.assign(o, ...os);
    expect(docs.length).toEqual(1);
    const ox = docs[0].toObject();
    delete ox.__v;
    delete ox.createdAt;
    delete ox.updatedAt;
    expect(ox).toEqual(o);
  }
});

const variant = (df, va) => _.defaultsDeep(va, df);

module.exports = {
  models,
  make,
  variant,
  check,
};
