/* @index.js
 *
 * API route handler
 * These routes match the first subdirectory in the URL and loads the
 * corresponding file.
 *
 * e.g. http://localhost/api/subdir1/
 * router.use('/api/subdir1', require('./subdir1'));
 *
 */

const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/tasks', require('./tasks'));
router.use('/categories', require('./categories'));

module.exports = router;
