/* @tasks.js
 *
 * Routes for /tasks
 *
 */
const router = require('express').Router();
const {
  getDB
} = require('../lib/db');
const TomatoError = require("../lib/tomato-error");

const {
  genAuthToken,
  requireAuth
} = require('../lib/auth');


/*
 * Get all Tasks for a User
 *
 */
router.get('/', requireAuth, (req, res, next) => {
  const db = getDB();
  // Fetch ID from JWT token
  let user_id = req.user.user_id;

  try {

    console.log(" == getTasks: ", user_id);

    let sql = 'SELECT * from tasks INNER JOIN categories ON tasks.category_id = categories.category_id WHERE tasks.user_id = ?';

    db.query(sql, user_id, function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        // Check for result not found

        // if results
        console.log('results', results);
        res.status(200).send(results);
      }
    });

  } catch (err) {
    console.log('== route err catch');
    // Throw for all errors including DB issues
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }
});


/*
 * Create a new Task
 *
 */
router.post('/', requireAuth, (req, res, next) => {
  const db = getDB();
  // Fetch ID from JWT token
  let user_id = req.user.user_id;

  //  Validate required fields here
  if (true) {
    try {

      console.log(" == insertNewTask: ", req.body);

      let sql = 'INSERT INTO tasks (user_id, category_id, task_name, description, time_duration) VALUES (?, ?, ?, ?, ?)';
      const task = [
        user_id,
        req.body.category_id,
        req.body.task_name,
        req.body.description,
        req.body.time_duration,
      ];

      console.log("== task", task);
      db.query(sql, task, function(err, results) {
        if (err) {
          // Pass any database errors to the error route
          next(new TomatoError("Database error: " + err.message, 500));
        } else {
          console.log("== results ", results);
          res.status(201).send({
            id: results.insertId
          });
        }
      });

    } catch (err) {
      console.log('== route err catch');
      // Throw for all errors including DB issues
      next(new TomatoError("Internal error adding tas: " + err.message, 500));
    }

  } else {
    next(new TomatoError("Request is not valid", 400));
  }
});


/*
 * Get details of a Task
 *
 */
router.get('/:id', requireAuth, (req, res, next) => {
  const db = getDB();
  // Fetch ID from JWT token
  let user_id = req.user.user_id;

  try {

    console.log(" == getTaskDetails: ", req.params.id);

    let sql = 'SELECT * FROM tasks INNER JOIN categories ON tasks.category_id = categories.category_id WHERE task_id = ? AND tasks.user_id = ?';

    db.query(sql, [req.params.id, user_id], function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        // Check for result not found
        console.log('results', results);
        res.status(200).send(results[0]);
      }
    });

  } catch (err) {
    console.log('== route err catch');
    // Throw for all errors including DB issues
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }

});


/*
 * Update a Task
 *
 */
router.patch('/:id', requireAuth, (req, res, next) => {
  const db = getDB();
  // Fetch ID from JWT token
  let user_id = req.user.user_id;

  // Check here if field set matches
  try {

    console.log(" == updateTask: ", req.body);

    let sql = 'UPDATE tasks SET ? WHERE task_id = ? AND user_id = ?';

    db.query(sql, [req.body, req.params.id, user_id], function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
          console.log('results', results );
          res.status(200).send({});

      }
    });

  } catch (err) {
    console.log('== route err catch');
    // Throw for all errors including DB issues
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }
});


/*
 * Delete a Task
 *
 */
router.delete('/:id', requireAuth, (req, res, next) => {
  const db = getDB();

  // Fetch user ID from JWT token
  let user_id = req.user.user_id;

  try {

    console.log(" == deleteTask: ", req.params.id);

    // Delete all tasks for this user
    let sql = 'DELETE from tasks WHERE task_id = ?';

    db.query(sql, req.params.id, function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        res.status(200).send({});
      }
    });

  } catch (err) {
    console.log('== route err catch');
    // Throw for all errors including DB issues
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }
});



module.exports = router;
