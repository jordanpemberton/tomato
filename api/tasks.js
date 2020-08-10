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
  let user_id = req.user.user_id;

  try {

    let sql = 'SELECT * from tasks RIGHT JOIN categories ON tasks.category_id = categories.category_id WHERE categories.user_id = ?';

    db.query(sql, user_id, function(err, results) {
      if (err) {
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        res.status(200).send(results);
      }
    });

  } catch (err) {
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }
});


/*
 * Create a new Task
 *
 */
router.post('/', requireAuth, (req, res, next) => {
  const db = getDB();
  let user_id = req.user.user_id;

  try {

    let sql = 'INSERT INTO tasks (user_id, category_id, task_name, description, time_duration) VALUES (?, ?, ?, ?, ?)';
    const task = [
      user_id,
      req.body.category_id,
      req.body.task_name,
      req.body.description,
      req.body.time_duration,
    ];

    db.query(sql, task, function(err, results) {
      if (err) {
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        res.status(201).send({
          id: results.insertId
        });
      }
    });

  } catch (err) {
    next(new TomatoError("Internal error adding tas: " + err.message, 500));
  }


});


/*
 * Get details of a Task
 *
 */
router.get('/:id', requireAuth, (req, res, next) => {
  const db = getDB();
  let user_id = req.user.user_id;

  try {

    let sql = 'SELECT * FROM tasks INNER JOIN categories ON tasks.category_id = categories.category_id WHERE task_id = ? AND tasks.user_id = ?';

    db.query(sql, [req.params.id, user_id], function(err, results) {
      if (err) {
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        console.log('results', results);
        res.status(200).send(results[0]);
      }
    });

  } catch (err) {
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }

});


/*
 * Update a Task
 *
 */
router.patch('/:id', requireAuth, (req, res, next) => {
  const db = getDB();
  let user_id = req.user.user_id;

  try {

    let sql = 'UPDATE tasks SET ? WHERE task_id = ? AND user_id = ?';

    db.query(sql, [req.body, req.params.id, user_id], function(err, results) {
      if (err) {
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        res.status(200).send({});
      }
    });

  } catch (err) {
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }
});


/*
 * Delete a Task
 *
 */
router.delete('/:id', requireAuth, (req, res, next) => {
  const db = getDB();
  let user_id = req.user.user_id;

  try {

    let sql = 'DELETE from tasks WHERE task_id = ?';

    db.query(sql, req.params.id, function(err, results) {
      if (err) {
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        res.status(200).send({});
      }
    });

  } catch (err) {
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }
});



module.exports = router;
