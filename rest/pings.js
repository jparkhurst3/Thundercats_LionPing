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

  // INSERT INTO PING (ServiceID, Name, Description, Status) VALUES (1,'Database is broken?', 'Database stopped', 'Acknowledged');
  var values = '('+ req.query.serviceID + ',' + req.query.name + ',' + req.query.description + ',Open)'
  var query = 'INSERT INTO PING (ServiceID, Name, Description, Status) VALUES ' + values
  database.executeQuery(query, (error, rows, fields) => {
    if (error) {
      console.log(error);
      res.statusCode = 500;
      res.end("error");
    } else {
      console.log('posted')
      res.statusCode = 200;
      res.send(JSON.stringify(rows))
    }
  })
}


module.exports = {
	getPingsForService : getPingsForService
}