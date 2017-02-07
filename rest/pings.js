var database = require('../database/database.js');

var getPingsForService = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');

	var whereClause = (req.query.ID) ? " WHERE (s.ID = ?)" : " WHERE (s.Name = ?)";
  var queryParam = (req.query.ID) ? (req.query.ID) : (req.query.Name);

  database.executeQuery('SELECT p.ID, p.ServiceID, p.Name, p.Description, p.Status, p.CreatedTime FROM PING p JOIN SERVICE s ON (p.ServiceID = s.ID) ' + whereClause, queryParam, (error, rows, fields) => {
    if (error) {
      console.log(error);
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(JSON.stringify(rows));
    }
  });
}

var createPingForService = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  database.executeQuery('INSERT p.ID, p.Name, p.Description, p.Status, p.CreateTime INTO PING p JOIN SERVICE s on (p.ServiceID = s.ID) WHERE s.Name = ?', req.query.Name. (error, rows, fields) => {
    if (error) {
      console.log(error);
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(JSON.stringify(rows))
    }
  })
}


module.exports = {
	getPingsForService : getPingsForService
}