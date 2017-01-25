var mysql = require('mysql');

var executeQuery = function(query, callback) {
  var connection = mysql.createConnection({
    host:'cleggchrsdb.chud162mg8im.us-west-2.rds.amazonaws.com',
    user:'cclegg7',
    password:'chrisclegg',
    database:'lion_ping'
  });
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