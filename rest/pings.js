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

module.exports = {
	getPingsByServiceID : getPingsByServiceID
}