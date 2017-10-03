var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Schema for each event stored in the database
var eventModel = new Schema({
  title: {type: String},
  slug: {type: String},
  speaker: {type: String},
  shortDescription: {type: String},
  longDescription: {type: String},
  duration: {type: Number},
  day: {type: Number},
  time: {type: Number},
  topics: {type: Array},
  // Should this be visible on the frontend?
  published: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Event', eventModel);
