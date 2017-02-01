var database = require('../database/database.js');

/**
* Service for getting names of all services
* Params: None
* Returns: Names of services
*/
var getNames = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('SELECT * FROM USER', (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      const serviceNames = rows.map((row) => row['Name']);
      res.send(JSON.stringify(serviceNames))
    }
  })
};

module.exports = {
  getNames : getNames,
}