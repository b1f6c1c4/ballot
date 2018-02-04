const mongoose = require('mongoose');
const { fixUpdate } = require('../mongo');

const { Schema } = mongoose;

const OrganizerSchema = new Schema({
  _id: {
    type: String,
  },
  hash: {
    type: String,
  },
}, {
  id: false,
  shardKey: {
    _id: 1,
  },
  timestamps: { },
});

OrganizerSchema.plugin(fixUpdate);

module.exports = {
  OrganizerSchema,
  Organizer: mongoose.model('organizers', OrganizerSchema),
};
