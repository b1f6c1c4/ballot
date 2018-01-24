const mongoose = require('mongoose');
const { fixUpdate } = require('../mongo');

const { Schema } = mongoose;

const BallotCryptoSchema = new Schema({
  q: {
    type: String,
    lowercase: true,
  },
  g: {
    type: String,
    lowercase: true,
  },
  h: {
    type: String,
    lowercase: true,
  },
}, {
  _id: false,
  id: false,
});

const BallotFieldSchema = new Schema({
  prompt: {
    type: String,
  },
  type: {
    type: String,
  },
  data: {
    type: [String],
  },
}, {
  _id: false,
  id: false,
});

const BallotVoterSchema = new Schema({
  _id: {
    type: String,
    lowercase: true,
  },
  name: {
    type: String,
  },
  comment: {
    type: String,
  },
  publicKey: {
    type: String,
    lowercase: true,
  },
}, {
  id: false,
});

const BallotSchema = new Schema({
  _id: {
    type: String,
    lowercase: true,
  },
  name: {
    type: String,
  },
  owner: {
    type: String,
  },
  status: {
    type: String,
  },
  crypto: BallotCryptoSchema,
  fields: [BallotFieldSchema],
  voters: [BallotVoterSchema],
}, {
  id: false,
  shardKey: {
    owner: 1,
    _id: 1,
  },
  timestamps: { },
});

BallotSchema.plugin(fixUpdate);

module.exports = {
  BallotSchema,
  Ballot: mongoose.model('ballots', BallotSchema),
};
