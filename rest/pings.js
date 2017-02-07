var database = require('../database/database.js');

var getPingsByServiceID = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('SELECT * FROM PING WHERE (ServiceID = ?)', req.query.ID, (error, rows, fields) => {
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

module.exports = {
	getPingsByServiceID : getPingsByServiceID,
	getPingsForService : getPingsForService
}