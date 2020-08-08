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
 * @TODO add field validation
 */
router.post('/', isEmailUnique, isUserUnique, async (req, res, next) => {
  const db = getDB();
  //  Validate required fields here
  if (true) {
    try {

      console.log(" == insertNewUser: ", req.body);

      let sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      const passwordHash = await bcrypt.hash(req.body.password, 8);
      const user = [
        req.body.username,
        req.body.email,
        passwordHash
      ];

      console.log("== user", user);
      db.query(sql, user, function(err, results) {
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
      next(new TomatoError("Internal error adding user: " + err.message, 500));
    }

  } else {
    next(new TomatoError("Request is not valid", 400));
  }
});


/*
 * Get the details of a User
 *
 */
router.get('/:id', requireAuth, userIsUser, (req, res, next) => {
  const db = getDB();

  // Check here if ID of user matches ID of JWT token
  console.log('== Bearer Token', req.user);

  try {

    console.log(" == getUserDetails: ", req.params.id);

    let sql = 'SELECT user_id, username, email from users WHERE user_id = ?';

    db.query(sql, [req.params.id], function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        // Check for result not found

        // if results
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
 * Update the details of a User
 *
 * @TODO verify field set
 */
router.patch('/:id', requireAuth,
                     userIsUser,
                     isEmailUnique,
                     isUserUnique,
                     async (req, res, next) => {
                       
  const db = getDB();

  //  Validate required fields here
  try {

    console.log(" == updateUser: ", req.body);

    let sql = 'UPDATE users SET ? WHERE user_id = ?';
    let user = req.body;
    // Crypt the password if there was a password update
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 8);
    }


    db.query(sql, [user, req.params.id], function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        console.log('results', results);
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
 * Delete a User account
 *
 */
// router.delete('/:id/reset', async (req, res, next) => {
//   res.status(200).send({
//     body: 'delete an account'
//   });
// });


/*
 * Reset a User account - Delete all Categories & Tasks
 *
 */
router.delete('/:id/reset', requireAuth, userIsUser, (req, res, next) => {
  const db = getDB();

  try {

    console.log(" == resetUser: ", req.params.id);

    // MySQL FK ON CASCADE will delete tasks when categories are deleted
    let sql = 'DELETE from categories WHERE user_id = ? ;';

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


/*
 * Attempt to log a user in
 *
 */
router.post('/login', async (req, res, next) => {
  const db = getDB();

  try {

    // Fetch user details from the data base
    let sql = "SELECT * FROM users where username = ?";
    db.query(sql, req.body.username, async function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {

        let input = req.body;
        let dbUser = results[0];
        console.log("== results", dbUser, "input", input);

        // Verify password
        if (results && await bcrypt.compare(input.password, dbUser.password)) {

          // Token does not need crypt password
          delete dbUser.password;

          // Generate a JWT token with the user payload
          const token = genAuthToken(dbUser);

          res.status(200).send({
            token: token
          });
        } else {
          next(new TomatoError("Authentication failed.", 401));
        }
      }
    });


  } catch (err) {
    console.error(err);
    next(new TomatoError("Authentication error.  Please try again later.", 500));
  }
});


module.exports = router;
