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

var createPing = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  database.executeQuery('INSERT INTO PING SET ServiceID = ?, Name = ?, Description = ?, Status = "Open"', [req.body.ServiceID, req.body.Name, req.body.Description], (error, rows, fields) => {
    if (error) {
      console.log(error);
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(JSON.stringify(rows.insertId))
    }
  })
}



module.exports = {
	getPingsForService : getPingsForService,
	createPing : createPing
}