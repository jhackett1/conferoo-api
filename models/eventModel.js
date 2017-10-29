var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Schema for each event stored in the database
var eventModel = new Schema({
  title: {type: String, required: true},
  // Store ID of speaker
  speaker: {type: String, default: null},
  // Stores URL string
  image: {type: String, default: null},
  teaser: {type: String, required: true},
  content: {type: String, default: null},
  // Number of minutes
  duration: {type: Number, required: true},
  // Store time as string HHMM
  time: {type: Number, required: true},
  programme: {type: String, required: true},
  // Array of strings
  themes: {type: Array, default: []},
  // Bool for frontend visibility
  published: {
    type: Boolean,
    required: true,
    default: true
  }
}, { versionKey: false });

module.exports = mongoose.model('Event', eventModel);
