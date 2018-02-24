const jestMongoose = require('jest-mongoose');
const { connect } = require('../mongo');
const { Organizer } = require('../models/organizers');
const { Ballot } = require('../models/ballots');
const { SubmittedTicket } = require('../models/submittedTickets');
const { SignedTicket } = require('../models/signedTickets');

module.exports = jestMongoose({
  Organizer,
  Ballot,
  SubmittedTicket,
  SignedTicket,
}, connect);
