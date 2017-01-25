var mysql = require('mysql');
var config = require('config');

var executeQuery = function(query, callback) {
  var connection = mysql.createConnection(config.get('db'));
  connection.connect();
  connection.query(query, callback);
  connection.end(function(err){
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  executeQuery : executeQuery
}