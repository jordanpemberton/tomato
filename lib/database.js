/* database.js
 *
 * Promisified MySQL Database Wrapper
 *
 * Modified from: 
 *  Michał Męciński
 *  https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628
 *
 */

const util = require( 'util' );
const mysql = require( 'mysql' );

function backendDatabase( config )  {
  const connection = mysql.createConnection( config );

  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };

}

module.exports = backendDatabase;
