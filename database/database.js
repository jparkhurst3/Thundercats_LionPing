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

module.exports = {
  executeQuery : executeQuery
}