var database = require('../database/database.js');

/**
* Service for getting list of all users
* Params: None
* Returns: Username, First Name, Last Name of all users
*/
var getUsers = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('SELECT Username,FirstName,LastName FROM USER', (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(JSON.stringify(rows));
    }
  })
};

/**
* Service for creating a new user
* Params: Name, Password, FirstName, LastName for new user
* Returns: ID of newly created user
*/
var createUser = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var queryParams = [req.body.Username,req.body.Password,req.body.FirstName,req.body.LastName];
  database.executeQuery('INSERT INTO USER SET Username=?, Password=?, FirstName=?, LastName=?', queryParams, (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(String(rows.insertId));
    }
  })
};

var getUser = function(req,res) {
  res.setHeader('Content-Type', 'text/plain');

  var getPingQuery = 'SELECT * FROM USER WHERE Username=? ';
  database.executeQuery(getPingQuery, req.query.Username, (error, rows, fields) => {
    if (error || rows.length == 0) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(JSON.stringify(rows[0]));
    }
  });
}


module.exports = {
  getUsers : getUsers,
  createUser : createUser,
  getUser : getUser
}