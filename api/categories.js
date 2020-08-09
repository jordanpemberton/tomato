/* @categories.js
 *
 * Routes for /categories
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
 * Get all Categories for a user
 *
 */
router.get('/', requireAuth, (req, res, next) => {
  const db = getDB();
  let user_id = req.user.user_id;

  try {

    let sql = 'SELECT * from categories WHERE user_id = ?';

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
 * Create a new Category
 *
 */
router.post('/', requireAuth, (req, res, next) => {
  const db = getDB();
  let user_id = req.user.user_id;

  try {

    let sql = 'INSERT INTO categories (user_id, category_name) VALUES (?, ?)';
    let cat = [
      user_id,
      req.body.category_name
    ];

    db.query(sql, cat, function(err, results) {
      if (err) {
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        res.status(201).send({
          id: results.insertId
        });
      }
    });

  } catch (err) {
    next(new TomatoError("Internal error adding category: " + err.message, 500));
  }

});


/*
 * Update a Category
 *
 */
router.patch('/:id', requireAuth, (req, res, next) => {
  const db = getDB();
  let user_id = req.user.user_id;

  try {

    let sql = 'UPDATE categories SET ? WHERE category_id = ? AND user_id = ?';

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
 * Delete a Category
 *
 */
router.delete('/:id', requireAuth, (req, res, next) => {
  const db = getDB();
  let user_id = req.user.user_id;

  try {
    // MySQL FK ON CASCADE will delete tasks when categories are deleted
    let sql = 'DELETE from categories WHERE category_id = ? AND user_id = ?;';

    db.query(sql, [req.params.id, user_id], function(err, results) {
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
