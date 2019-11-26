// Our main application file.
// Pull in the required modules.
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const motionAlarm = require('./lib/motion-alarm');

// Create the express app.
const app = express();

// Configure the app.
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add our express routes
const routes = require('./api/routes/index'); //importing route
routes(app); //register the route

module.exports = app;
