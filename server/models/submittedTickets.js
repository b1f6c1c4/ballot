const mongoose = require('mongoose');

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
  timestamps: { },
});

const SubmittedTicketSchema = new Schema({
  _id: {
    type: String,
    lowercase: true,
  },
  ticket: SignedTicketSchema,
  status: {
    type: String,
  },
});

module.exports = mongoose.model('submittedTickets', SubmittedTicketSchema);
