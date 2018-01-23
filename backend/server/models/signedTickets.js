const mongoose = require('mongoose');
const { fixUpdate } = require('../mongo');

const { Schema } = mongoose;

const TicketSchema = new Schema({
  bId: {
    type: String,
    lowercase: true,
  },
  result: {
    type: [String],
  },
}, {
  _id: false,
  id: false,
});

const SignedTicketSchema = new Schema({
  _id: {
    type: String,
    lowercase: true,
  },
  payload: TicketSchema,
  s: {
    type: [String],
    lowercase: true,
  },
  c: {
    type: [String],
    lowercase: true,
  },
}, {
  id: false,
  shardKey: {
    _id: 1,
  },
  timestamps: { },
});

SignedTicketSchema.plugin(fixUpdate);

module.exports = mongoose.model('signedTickets', SignedTicketSchema);
