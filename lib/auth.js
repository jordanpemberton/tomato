/* @auth.js
 *
 * Authentication related functions
 */

const TomatoError = require("../lib/tomato-error");
const {
  getDB
} = require('./db');
const jwt = require('jsonwebtoken');
const secretKey = 'stop, tomato time!';

/*
 * Generate a JWT Token
 */
exports.genAuthToken = (user) => {
  const payload = {
    user_id: user.user_id,
    email: user.email,
    username: user.username
  };
  return jwt.sign(payload, secretKey, {
    expiresIn: '24h'
  });
};

/*
 * Pre route to ensure that a user is logged in with a valid JWT token
 *
 */
exports.requireAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

  try {

    if (!token) {
      throw new TomatoError("No token presented.", 401);
    }

    // Save token data back into req for later use
    req.user = jwt.verify(token, secretKey);

    next();
  } catch (err) {
    next(new TomatoError("Invalid authentication token", 403))
  }
}


/*
 * Middleware for user routes to determine that the user_id requested
 * matches the user_id of the JWT token.
 *
 */
exports.userIsUser = (req, res, next) => {

  if (req.user.user_id == req.params.id) {
    next();
  } else {
    next(new TomatoError("Not authorized", 403))
  }

}


/*
 * Middleware for user routes to determine if an
 * email already exists in the database
 *
 */
exports.isEmailUnique = (req, res, next) => {
  const db = getDB();

  if (req.body.email) {
    try {

      let sql = 'SELECT email from users WHERE email = ? ;';

      db.query(sql, req.body.email, function(err, results) {
        if (err) {
          res.status(500).send({
            error: "Database error: " + err.message
          });

        } else {

          if (results[0] && results[0].email) {

            // if next() with a tomato error is thrown here mysql
            // exception handling crashes
            res.status(409).send({
              error: 'Duplicate e-mail'
            });

          } else {
            next();
          }

        }
      });

    } catch (err) {
      next(new TomatoError("Internal error in isEmailUnique: " + err.message, 500));
    }

  }

}

/*
 * Middleware for user routes to determine if an
 * email already exists in the database
 *
 */
exports.isUserUnique = (req, res, next) => {
  const db = getDB();

  if (req.body.username) {
    try {

      let sql = 'SELECT username from users WHERE username = ? ;';

      db.query(sql, req.body.username, function(err, results) {
        if (err) {
          res.status(500).send({
            error: "Database error: " + err.message
          });

        } else {

          if (results[0] && results[0].username) {
            res.status(406).send({
              error: 'Duplicate username'
            });

          } else {
            next();
          }

        }
      });

    } catch (err) {
      next(new TomatoError("Internal error in isEmailUnique: " + err.message, 500));
    }

  }

}
