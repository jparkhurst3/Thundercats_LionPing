var mysql = require('mysql');
var config = require('config');

var executeQuery = function(query, parameters, callback) {
  var connection = mysql.createConnection(config.get('db'));
  connection.connect();
  if (callback) {
    connection.query(query, parameters, callback);
  } else {
    callback = parameters; //If only 2 arguments, second parameter is callback
    connection.query(query, callback);
  }
  connection.end(function(err){
    if (err) {
      console.log(err);
    }
  });
}

var executeQueryInTransaction = function(query, transaction, parameters, callback) {
  var connection = transaction.connection;
  if (callback) {
    connection.query(query, parameters, callback);
  } else {
    callback = parameters; //If only 3 arguments, third parameter is callback
    connection.query(query, callback);
  }
}

var commit = function() {
  this.connection.commit(function(error) {
    if (error) {
      this.rollback(error);
    }
  });
  this.connection.end(function(err){
    if (err) {
      console.log(err);
    }
  });
}

var rollback = function(error) {
  this.connection.rollback();
  if (error) {
    console.log(error);
  } 
  this.connection.end(function(err){
    if (err) {
      console.log(err);
    }
  });
}

var createTransaction = function() {
  let connection = mysql.createConnection(config.get('db'));
  connection.connect();
  connection.beginTransaction();
  let transaction = {
    connection : connection,
    commit : commit,
    rollback : rollback
  }
  return transaction;
}

module.exports = {
  executeQuery : executeQuery,
  executeQueryInTransaction : executeQueryInTransaction,
  createTransaction : createTransaction
}