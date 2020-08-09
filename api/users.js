/* @users.js
 *
 * Routes for /api/users
 *
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs')
const {
  getDB
} = require('../lib/db');
const TomatoError = require("../lib/tomato-error");

const {
  genAuthToken,
  requireAuth,
  userIsUser,
  isEmailUnique,
  isUserUnique
} = require('../lib/auth');


/*
 * Create a new User account
 *
 */
router.post('/', isEmailUnique, isUserUnique, async (req, res, next) => {
  const db = getDB();

  try {

    let sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const passwordHash = await bcrypt.hash(req.body.password, 8);
    const user = [
      req.body.username,
      req.body.email,
      passwordHash
    ];

    db.query(sql, user, function(err, results) {
      if (err) {
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        res.status(201).send({
          id: results.insertId
        });
      }
    });

  } catch (err) {
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }


});


/*
 * Get the details of a User
 *
 */
router.get('/:id', requireAuth, userIsUser, (req, res, next) => {
  const db = getDB();

  try {

    let sql = 'SELECT user_id, username, email from users WHERE user_id = ?';

    db.query(sql, [req.params.id], function(err, results) {
      if (err) {
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        res.status(200).send(results[0]);
      }
    });

  } catch (err) {
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }


});


/*
 * Update the details of a User
 *
 */
router.patch('/:id', requireAuth,
  userIsUser,
  isEmailUnique,
  isUserUnique,
  async (req, res, next) => {

    const db = getDB();

    try {

      let sql = 'UPDATE users SET ? WHERE user_id = ?';
      let user = req.body;

      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 8);
      }

      db.query(sql, [user, req.params.id], function(err, results) {
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
 * Reset a User account - Delete all Categories & Tasks
 *
 */
router.delete('/:id/reset', requireAuth, userIsUser, (req, res, next) => {
  const db = getDB();

  try {

    // MySQL FK ON CASCADE will delete tasks when categories are deleted
    let sql = 'DELETE from categories WHERE user_id = ? ;';

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


/*
 * Attempt to log a user in
 *
 */
router.post('/login', async (req, res, next) => {
  const db = getDB();

  try {

    let sql = "SELECT * FROM users where username = ?";

    db.query(sql, req.body.username, async function(err, results) {
      if (err) {
        next(new TomatoError("Database error: " + err.message, 500));
      } else {

        if (results[0]) {

          let input = req.body;
          let dbUser = results[0];

          if (results && await bcrypt.compare(input.password, dbUser.password)) {

            // Token does not need crypt password
            delete dbUser.password;
            const token = genAuthToken(dbUser);

            res.status(200).send({
              token: token
            });

          } else {
            next(new TomatoError("Authentication failed.", 401));
          }
        } else {
          next(new TomatoError("User not found.", 404));
        }
      }
    });


  } catch (err) {
    next(new TomatoError("Authentication error.  Please try again later.", 500));
  }
});


module.exports = router;
