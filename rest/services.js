var database = require('../database/database.js');

/**
* Service for getting names of all services
* Params: None
* Returns: Names of services
*/
var getNames = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('SELECT * FROM SERVICE', (error, rows, fields) => {
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

/**
* Service for creating a new service
* Params: Name
* Returns: ID of newly created service
*/
var create = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('INSERT INTO SERVICE (Name) VALUES (?)', [req.body.Name], (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(String(rows.insertId));
    }
  })
}

/**
  TODO
  
  getEscalationPolicyByID
  getPingsByServiceId
  updateEscalationPolicy - updates the entire policy - not the layer

*/

module.exports = {
  getNames : getNames,
  create : create
}