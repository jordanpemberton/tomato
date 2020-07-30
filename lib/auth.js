/* @auth.js
 *
 * Authentication related functions
 */

const TomatoError = require("../lib/tomato-error");

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
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
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
    // Ensure that a token was provided
    if (!token) {
      throw new TomatoError("No token presented.", 401);
    }

    // Save token data back into req for later use
    req.user = jwt.verify(token, secretKey);

    console.log("== contents of bearer token", req.user);

    next();
  } catch (err) {
    // JWT token verification failed
    next(new TomatoError("Invalid authentication token", 403))
  }
}


/*
 * Middleware for user routes to determine that the user_id requested
 * matches the user_id of the JWT token.
 *
 */
exports.userIsUser = (req, res, next) => {

  console.log("== user is user", req.user, req.params.id);

  if (req.user.user_id == req.params.id) {
    next();
  } else {
    next(new TomatoError("Not authorized", 403))
  }

}
