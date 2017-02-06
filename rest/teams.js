var database = require('../database/database.js');

/**
* Service for getting Names/IDs of all Teams
* Params: None
* Returns: Names/ID of Teams
*/
var getTeams = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('SELECT Name,ID FROM TEAM', (error, rows, fields) => {
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
* Service for getting Schedules of all Teams
* Params: None
* Returns: TeamID, TeamName, ScheduleName for each schedule
*/
var getSchedules = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('SELECT t.Name as TeamName, s.Name as ScheduleName, t.ID as TeamID FROM TEAM t JOIN SCHEDULE s ON (t.ID = s.TeamID)', (error, rows, fields) => {
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
* Service for creating a new team
* Params: Name, Users
* Returns: ID of newly created team
*/
var createTeam = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  var transaction = database.createTransaction();

  new Promise(function(resolve,reject) {
    database.executeQueryInTransaction('INSERT INTO TEAM SET Name = ?', transaction, req.body.Name, (error,rows,fields) => {
      if (error) reject(error);
      else resolve(rows.insertId);
    });
  }).then((teamID) => {
    return new Promise((resolve,reject) => {
      database.executeQueryInTransaction('INSERT INTO SCHEDULE SET TeamID= ?, Name = ?', transaction, [teamID,"Default"], (error,rows,fields) => {
        if (error) reject(error);
        else resolve(teamID);
      });
    });
  }).then((teamID) => {
    var insertAllUsers = req.body.Users.map(function(user) {
      return new Promise((resolve,reject) => {
        database.executeQueryInTransaction('INSERT INTO USER_IN_TEAM SET Username = ?, TeamID = ?', transaction, [user,teamID], (error,rows,fields) => {
          if (error) reject(error);
          else resolve();
        });
      });
    });
    return Promise.all(insertAllUsers);
  }).then(() => {
    transaction.commit();
    res.statusCode = 200;
    res.send("Successfully created team");
  }).catch((error) => {
    transaction.rollback();
    console.log(error);
    res.statusCode = 500;
    res.send("Error creating team");
  });
}

module.exports = {
  getTeams : getTeams,
  createTeam : createTeam,
  getSchedules : getSchedules
}