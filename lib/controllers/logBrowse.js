'use strict';

var mongoose = require('mongoose'),
    Browse = mongoose.model('Browse');
/*
 * req.body = {
 *   uid: 1,
 *   site: "www.google.com",
 *   time: 10 // seconds
 * }
 */
exports.logActiveTime = function(req, res) {
  if (!req.body.uid || !req.body.site || !req.body.time) {
    return res.send(400);
  }
  var uid = req.body.uid;
  var site = req.body.site;
  var time = parseFloat(req.body.time);
  var date = new Date();
  date = date.toDateString();
  Browse.findOneAndUpdate({uid:uid, site:site, date:date}, {$inc: {activeTime: time}}, {upsert: true}, function(err, doc) {
    if (err) {
      console.log(err);
      return res.send(400);
    }
    return res.send(200);
  });
};

/*
 * req.body = {
 *   uid: 1,
 *   site: "www.google.com",
 * }
 */
exports.logVisitTimes = function(req, res) {
  if (!req.body.uid || !req.body.site) {
    return res.send(400);
  }
  var uid = req.body.uid;
  var site = req.body.site;
  var date = new Date();
  date = date.toDateString();
  Browse.findOneAndUpdate({uid:uid, site:site, date:date}, {$inc: {visitTimes: 1}}, {upsert: true}, function(err, doc) {
    if (err) {
      console.log(err);
      return res.send(400);
    }
    return res.send(200);
  });
};

/*
 * req.body = {
 *   uid: 1,
 *   site: "www.google.com",
 *   answer: "what?"
 * }
 */
exports.logAnswers = function(req, res) {
  if (!req.body.uid || !req.body.site) {
    return res.send(400);
  }
  var uid = req.body.uid;
  var site = req.body.site;
  var answer = req.body.answer;
  var date = new Date();
  date = date.toDateString();
  Browse.findOneAndUpdate({uid:uid, site:site, date:date}, {$push: {answers: {answer: answer}}}, {upsert: true}, function(err, doc) {
    if (err) {
      console.log(err);
      return res.send(400);
    }
    return res.send(200);
  });
};

/*
 * req.body = {
 *   uid: 1,
 *   site: "www.google.com",
 *   time: 10 (mins)
 * }
 */
exports.logEstimateAT = function(req, res) {
  if (!req.body.uid || !req.body.site || !req.body.time) {
    return res.send(400);
  }
  var uid = req.body.uid;
  var site = req.body.site;
  var time = req.body.time * 60;
  var date = new Date();
  date = date.toDateString();
  Browse.findOneAndUpdate({uid:uid, site:site, date:date}, {$push: {estimateAT: {estimate: time}}}, {upsert: true},  function(err) {
    if (err) {
      console.log(err);
      return res.send(400);
    }
    return res.send(200);
  });
};

/*
 * req.body = {
 *   uid: 1,
 *   site: "www.google.com",
 *   estimate_times: 5,
 *   real_times: 10
 * }
 */
exports.logEstimateVT = function(req, res) {
  if (!req.body.uid || !req.body.site || !req.body.estimate_times || !req.body.real_times) {
    return res.send(400);
  }
  var uid = req.body.uid;
  var site = req.body.site;
  var estimate = req.body.estimate_times;
  var real = req.body.real_times;
  var date = new Date();
  date = date.toDateString();
  Browse.findOneAndUpdate({uid:uid, site:site, date:date}, {$push: {estimateVT: {estimate: estimate, real: real}}}, {upsert: true}, function(err) {
    if (err) {
      console.log(err);
      return res.send(400);
    }
    return res.send(200);
  });
};
