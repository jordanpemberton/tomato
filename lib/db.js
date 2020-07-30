const dbConfig = require('./config');
const mysql = require('mysql');
let db = '';


exports.connectToMySQL = function (callback) {
  console.log("== Initalizing MySQL");
  db = mysql.createPool(dbConfig);

  console.log('== Connecting to MySQL server');
  db.getConnection(function(err) {
    if (err) {
      return console.error('Connection Error: ' + err.message);
    }
    console.log("===we have connected to MySQL");
    callback();
  });
};

exports.getDB = function () {
  return db;
};
