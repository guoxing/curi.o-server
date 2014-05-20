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

var uid = '6e0d7b3f-4a8e-c42b-5614-6046fc86f39d';

Browse.find({uid:uid}, function(err, docs) {
  var res = {};
  docs.forEach(function(doc) {
    if (!res[doc.site]) {
      res[doc.site] = {};
    }
    //if (!res[doc.site][doc.date]) {
      //res[doc.site][doc.date] = {};
    //}
    //if (res[doc.site][doc.date].totalActiveTime == undefined) {
      //res[doc.site][doc.date].totalActiveTime = 0;
    //}
    //res[doc.site][doc.date].totalActiveTime += doc.activeTime;

    //if (res[doc.site][doc.date].totalVisitTimes == undefined) {
      //res[doc.site][doc.date].totalVisitTimes = 0;
    //}
    //res[doc.site][doc.date].totalVisitTimes += doc.visitTimes;
    
    if (res[doc.site].totalActiveTime == undefined) {
      res[doc.site].totalActiveTime = 0;
    }
    res[doc.site].totalActiveTime += doc.activeTime;

    if (res[doc.site].totalVisitTimes == undefined) {
      res[doc.site].totalVisitTimes = 0;
    }
    res[doc.site].totalVisitTimes += doc.visitTimes;

    // aggregate estimate active time
    if (doc.estimateAT && doc.estimateAT.length > 0) {
      if (res[doc.site].totalEstimateActiveTime == undefined) {
        res[doc.site].totalEstimateActiveTime = 0;
        res[doc.site].totalEstimateTimes = 0;
      }
      doc.estimateAT.forEach(function(est) {
        res[doc.site].totalEstimateActiveTime += est.estimate;
        res[doc.site].totalEstimateTimes += 1;
      });
    }

    // aggregate estimate visit times
    if (doc.estimateVT && doc.estimateVT.length > 0) {
      if (res[doc.site].totalEstimateVisitTimes == undefined) {
        res[doc.site].totalEstimateVisitTimes = 0;
        res[doc.site].totalRecordVisitTimes = 0; // not total visit times
      }
      doc.estimateVT.forEach(function(est) {
        res[doc.site].totalEstimateVisitTimes += est.estimate;
        res[doc.site].totalRecordVisitTimes += est.real;
      });
    }
  });
  console.log(res);

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
