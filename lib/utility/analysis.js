var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');

mongoose.connect('mongodb://curio:curio@oceanic.mongohq.com:10065/app25068853');
var modelsPath = path.join(__dirname, '../models');
fs.readdirSync(modelsPath).forEach(function(file) {
  if (file[0] == '.') {
    return;
  }
  require(modelsPath + '/' + file);
});
Browse = mongoose.model('Browse');

var uid, version;
process.argv.forEach(function (val, index, array) {
  if (index == 2) {
    uid = val;
  }
  if (index == 3) {
    version = val;
  }
});

console.log('uid: ' + uid);
console.log('version: ' + version);

Browse.find({uid:uid}, function(err, docs) {
  var res = {};
  docs.forEach(function(doc) {
    var date = new Date(doc.date);
    var first = new Date('Mon May 12 2014');
    var last = new Date('Tue May 27 2014');

    if (date < first) {
      return;
    }
    if (date > last) {
      return;
    }
    if (!res[doc.site]) {
      res[doc.site] = {};
    }
    //if (!res[doc.site][doc.date]) {
      //res[doc.site][doc.date] = {};
    //}
    //if (res[doc.site][doc.date].deltaActiveTime == undefined) {
      //res[doc.site][doc.date].deltaActiveTime = 0;
    //}
    //res[doc.site][doc.date].deltaActiveTime += doc.activeTime;

    //if (res[doc.site][doc.date].deltaVisitTimes == undefined) {
      //res[doc.site][doc.date].deltaVisitTimes = 0;
    //}
    //res[doc.site][doc.date].deltaVisitTimes += doc.visitTimes;
    
    if (res[doc.site].deltaActiveTime == undefined) {
      res[doc.site].deltaActiveTime = 0;
    }
    if (res[doc.site].activeTimeWithFeedback == undefined) {
      res[doc.site].activeTimeWithFeedback = 0;
    }
    if (res[doc.site].activeTimeWithoutFeedback == undefined) {
      res[doc.site].activeTimeWithoutFeedback = 0;
    }
    if (doc.feedback == 'true') {
      res[doc.site].deltaActiveTime += doc.activeTime;
      res[doc.site].activeTimeWithFeedback += doc.activeTime;
    } else if (doc.feedback == 'false') {
      res[doc.site].deltaActiveTime -= doc.activeTime;
      res[doc.site].activeTimeWithoutFeedback += doc.activeTime;
    }

    if (res[doc.site].deltaVisitTimes == undefined) {
      res[doc.site].deltaVisitTimes = 0;
    }
    if (res[doc.site].visitTimesWithFeedback == undefined) {
      res[doc.site].visitTimesWithFeedback = 0;
    }
    if (res[doc.site].visitTimesWithoutFeedback == undefined) {
      res[doc.site].visitTimesWithoutFeedback = 0;
    }
    if (doc.feedback == 'true') {
      res[doc.site].deltaVisitTimes += doc.visitTimes;
      res[doc.site].visitTimesWithFeedback += doc.visitTimes;
    } else if (doc.feedback == 'false') {
      res[doc.site].deltaVisitTimes -= doc.visitTimes;
      res[doc.site].visitTimesWithoutFeedback += doc.visitTimes;
    }

    // aggregate estimate active time
    //if (doc.estimateAT && doc.estimateAT.length > 0) {
      //if (res[doc.site].totalEstimateActiveTime == undefined) {
        //res[doc.site].totalEstimateActiveTime = 0;
        //res[doc.site].totalEstimateTimes = 0;
      //}
      //doc.estimateAT.forEach(function(est) {
        //res[doc.site].totalEstimateActiveTime += est.estimate;
        //res[doc.site].totalEstimateTimes += 1;
      //});
    //}

    // aggregate estimate visit times
    //if (doc.estimateVT && doc.estimateVT.length > 0) {
      //if (res[doc.site].totalEstimateVisitTimes == undefined) {
        //res[doc.site].totalEstimateVisitTimes = 0;
        //res[doc.site].totalRecordVisitTimes = 0; // not total visit times
      //}
      //doc.estimateVT.forEach(function(est) {
        //res[doc.site].totalEstimateVisitTimes += est.estimate;
        //res[doc.site].totalRecordVisitTimes += est.real;
      //});
    //}
  });
  var activeTimeAvgDiff = 0;
  var visitTimesAvgDiff = 0;
  var numberOfValidSites = 0;
  for (site in res) {
    if (res[site].activeTimeWithFeedback + res[site].activeTimeWithoutFeedback < 60 * 20) {
      res[site].discard = true;
      continue;
    } else {
      res[site].discard = false;
      numberOfValidSites++;
    }
    activeTimeAvgDiff += Math.abs(res[site].deltaActiveTime);
    visitTimesAvgDiff += Math.abs(res[site].deltaVisitTimes);
  }
  console.log(res);
  console.log('number of valid sites: ' + numberOfValidSites);
  activeTimeAvgDiff /= numberOfValidSites;
  console.log('average delta in active time: ' + activeTimeAvgDiff);
  visitTimesAvgDiff /= numberOfValidSites;
  console.log('average delta in visit times: ' + visitTimesAvgDiff);
});

//Browse.aggregate([{$match:{uid:uid}}, {$group:{_id:"$site", totalTime:{$sum:"$activeTime"}}}], function(err, docs) {
  //var res = [];
  //docs.forEach(function(doc) {
    //var entry = {};
    //entry.site = doc._id;
    //entry.averageActiveTime = doc.totalTime / 7;
    //res.push(entry);
  //});
  //console.log(res);
//});

//Browse.aggregate([{$match:{uid:uid}}, {$group:{_id:"$site", totalTime:{$sum:"$visitTimes"}}}], function(err, docs) {
  //var res = [];
  //docs.forEach(function(doc) {
    //var entry = {};
    //entry.site = doc._id;
    //entry.averageVisitTimes = doc.totalTime / 7;
    //res.push(entry);
  //});
  //console.log(res);
//});
