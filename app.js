'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

var mongoUri;
if (app.get('env') == 'development') {
  mongoUri = 'mongodb://localhost/curio';
  console.log('running in dev mode');
}

var db = mongoose.connect(mongoUri);

var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function(file) {
  if (file[0] == '.') {
    return;
  }
  require(modelsPath + '/' + file);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', function(req, res) {
  res.render('index', {title:'Express'});
});

var logBrowse = require('./lib/controllers/logBrowse');
app.post('/api/active-time', logBrowse.logActiveTime);
app.post('/api/visit-times', logBrowse.logVisitTimes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});


module.exports = app;
