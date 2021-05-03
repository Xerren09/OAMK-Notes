var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//
var indexRouter = require('./routes/index');
//
var usersRouter = require('./routes/users');
var subjectRouter = require('./routes/subjects');
var homeworkRouter = require('./routes/homeworks');
var noteRouter = require('./routes/notes');
var scheduleRouter = require('./routes/schedule');
//
var app = express();
//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//
app.use('/', indexRouter);
//
app.use('/users', usersRouter);
app.use('/subject', subjectRouter);
app.use('/homework', homeworkRouter);
app.use('/note', noteRouter);
app.use('/sch', scheduleRouter);
//
module.exports = app;