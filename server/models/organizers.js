const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrganizerSchema = new Schema({
  _id: {
    type: String,
  },
  salt: {
    type: String,
    lowercase: true,
  },
  hash: {
    type: String,
    lowercase: true,
  },
}, {
  id: false,
  shardKey: {
    _id: 1,
  },
  timestamps: { },
});

module.exports = mongoose.model('organizers', OrganizerSchema);
