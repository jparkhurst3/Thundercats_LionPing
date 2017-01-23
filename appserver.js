var debug = process.env.NODE_ENV !== "production";

var express = require('express');
var app = express();
var mysql = require('mysql');
var fs = require("fs");

app.use(express.static('build'));

app.get('/listCities', function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  var connection = mysql.createConnection({
    host:'localhost',
    user:'cclegg7',
    password:'00002302a',
    database:'world'
  });
  connection.connect();
  var queriedName;
  var rows;
  connection.query('SELECT * FROM city', function(error, results, fields) {
    if (error) throw error;
    console.log("query results:");
    console.log(results);
    console.log(fields);
    console.log(error);
    queriedName = results[0].District;

    rows = JSON.stringify(results);
    res.end(rows);

  });
  connection.end(function(err){
    if (err) {
      console.log(err);
    }
  });
   // fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
   //     console.log( data );
   //     res.end( data );
   // });
})

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})
