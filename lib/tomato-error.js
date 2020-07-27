/* @file tomato-error.js
 *
 * Tomato Error handler will optionally accept a code when thown.
 * This can be used to return the proper HTTP response code when an
 * error conditions is encountered.
 *
 */

'use strict';

module.exports = function TomatoError(message, code = 500) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.code = code;
};

require('util').inherits(module.exports, Error);
