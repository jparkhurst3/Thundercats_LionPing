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

module.exports = {
  getUsers : getUsers,
}