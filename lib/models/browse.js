'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BrowseSchema = new Schema({
  uid: String,
  site: String,
  date: String,
  activeTime: {
    type: Number,
    default: 0
  },
  visitTimes: {
    type: Number,
    default: 0
  },
  answers: [{
    answer: String,
    time: {
      type: Date,
      default: Date.now
    }
  }]
});

mongoose.model('Browse', BrowseSchema);
