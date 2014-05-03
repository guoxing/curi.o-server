'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BrowseSchema = new Schema({
  uid: String,
  site: String,
  date: Date,
  activeTime: Number,
  visitTimes: Number
});

mongoose.model('Browse', BrowseSchema);
