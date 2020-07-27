/* server.js
 *
 * Tomato application entrance point. Serves up an express HTTP web server.
 *
 */
require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const TomatoError = require("./lib/tomato-error");
// Extended logger
//const logger = require('./lib/logger');
const api = require('./api');
const mysql = require('mysql');
const dbConfig = require('./lib/config');
const { connectToMySQL } = require("./lib/db");
const port = process.env.PORT || 8000;

/*
 * Set up express
 */
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(logger);

/*
 * API routes live under api/ directory
 */
app.use('/api', api);

/*
 * TomatoError handling route
 * This route will allow any other route to call next(new TomatoError(str, code))
 * when an exception occurs and this route will pick it up and send
 * the appropriate HTTP response code with the message,
 */
app.use('*', (err, req, res, next) => {

  // If for some reason there isn't a code, default to 500
  // This might happen if bodyParser fails on invalid JSON
  if (!err.code) {
    console.log("== TomatoError not thrown correctly, missing code, using default");
    err.code = 500;
  }
  console.error(" == Caught TomatoError: ", err.code, err.message);

  res.status(err.code).send({
    error: err.message
  });
});

/*
 * Default page not found route for invalid requests
 */
app.use('*', (req, res, next) => {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});



/*
 * Start up SQL and the Express Engine server
 */
connectToMySQL(()=>{
  console.log('== Starting Express');
  app.listen(port, function() {
    console.log("== Server is running on port", port);
  });
});
