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

/*
 * API routes live under api/ directory
 */
app.use('/api', api);
app.set('views', 'views');
app.use(express.static('public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.locals.title = "Sign In";
  res.render('signin');
})

app.get('/signup', function(req, res){
  res.locals.title = "Sign Up"
  res.render('signup');
})

app.get('/view_tasks', function(req,res){
  res.locals.title = "Tasks";
  res.render('tasks');
})

app.get('/view_categories', function(req,res){
  res.locals.title = "View Categories";
  res.render('category');
})

app.get('/view_account', function(req,res){
  res.locals.title = "View Account";
  res.render('account');
})

app.get('/timer_page', function(req,res){
  res.locals.title = "Timer";
  res.render('timer');
})

app.get('/edit_account', function(req,res){
  res.locals.title = "Edit Account";
  res.render('editaccount');
})

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
