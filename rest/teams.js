var database = require('../database/database.js');
var notifications = require('../notifications/notifications.js');
var teamService = require('../service/teams.js');

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
* Service for getting list of users on a specified team
* Params: team name/id
* Returns: Username, First Name, Last Name of all users on team
*/

var getUsersOnTeam = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var whereClause = (req.query.ID) ? " WHERE (t.TeamID = ?)" : " WHERE (t.Name = ?)";
  var queryParam = (req.query.ID) ? (req.query.ID) : (req.query.Name);
  var getUsersOnTeamQuery = "SELECT u.Username, u.FirstName, u.LastName FROM USER u" +
    " JOIN USER_IN_TEAM ut ON (ut.Username = u.Username) " + 
    " JOIN TEAM t ON (t.ID = ut.TeamID) " + whereClause;
  database.executeQuery(getUsersOnTeamQuery, queryParam, (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(JSON.stringify(rows));
    }
  })
} 

/**
* service for updating the users that are part of team
* params: Name: team name, Users: list of users (objects including field Username)
* returns: none
*/

var updateUsersOnTeam = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var deleteQuery = " DELETE FROM USER_IN_TEAM WHERE TeamID = ?";
  
  var transaction = database.createTransaction();

  new Promise(function(resolve,reject) {
    database.executeQueryInTransaction("SELECT ID FROM TEAM WHERE Name = ?", transaction, req.body.Name, (error,rows,fields) => {
      if (error) reject(error);
      else  {
        if (rows.length > 0) {
          resolve(rows[0].ID);
        } else {
          reject("Invalid Team Name");
        }
      }
    });
  }).then((TeamID) => {
    return new Promise(function(resolve,reject) {
      database.executeQueryInTransaction(deleteQuery, transaction, TeamID, (error,rows,fields) => {
        if (error) reject(error);
        else resolve(TeamID);
      });
    })   
  }).then((TeamID) => {
    var valueSets = req.body.Users.reduce(function(substring, user) {
      if (substring != "") {
        substring += ", ";
      }
      return substring + "(" + TeamID + ", \'" + user.Username + "\')";
    }, "");
    var insertQuery = " INSERT INTO USER_IN_TEAM (TeamID, Username) VALUES " + valueSets;
    console.log(insertQuery);
    return new Promise(function(resolve,reject) {
      database.executeQueryInTransaction(insertQuery, transaction, (error,rows,fields) => {
        if (error) reject(error);
        else resolve();
      });
    });     
  }).then(() => {
    transaction.commit();
    res.statusCode = 200;
    res.send("Successfully updated users in team");
  }).catch((error) => {
    transaction.rollback();
    console.log(error);
    res.statusCode = 500;
    res.send("Error updating users in team");
  });
} 

/**
* Service for creating a new schedule for a team
* Params: TeamID and ScheduleName
* Returns: None
*/

var createSchedule = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('INSERT INTO SCHEDULE SET TeamID = ?, Name = ?', [req.body.TeamID, req.body.ScheduleName], (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send("success");
    }
  })
}

/**
* Service for deleting an schedule
* Params: TeamID and ScheduleName
* Returns: None
*/

var deleteSchedule = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('DELETE FROM SCHEDULE WHERE (TeamID = ?) AND (Name = ?)', [req.body.TeamID, req.body.ScheduleName], (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send("success");
    }
  });
} 

/**
* Get schedules linked to a specifc team
* Params: Team ID
* Returns: List of Schedules
*/
var getSchedulesForTeamByID = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var getUsersInEscalation = "SELECT s.Name as ScheduleName FROM TEAM t " +
    " JOIN SCHEDULE s ON (s.TeamID = t.ID) " +
    " WHERE (t.ID = ?)";

  database.executeQuery(getUsersInEscalation, req.query.ID, (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(JSON.stringify(rows));
    }
  })
}

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

var repeatTypes = ["daily", "weekly"];

/**
* Get Schedules linked to a specific Team
* Params: Service ID or Name
* Returns Escalation Policy
*/
var getSchedulesForTeam = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  var nameOrID = (req.query.ID) ? "ID" : "Name";
  var queryParam = (req.query.ID) ? (req.query.ID) : (req.query.Name);

  teamService.getSchedulesForTeam(nameOrID,queryParam).then((schedules) => {
    res.statusCode = 200;
    // notifications.notifySchedule(teamSchedules.Schedules[0]);
    res.send(JSON.stringify(schedules));
  }).catch((error) => {
    console.log(error);
    res.statusCode = 500;
    res.send("Error getting schedules for team.");
  });
} 

/**
* Service for creating a new override shift
* Params: shift object
* Returns: ID of newly created shift
*/
var createOverrideShift = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var shift = req.body;
  var insertParams = [shift.TeamID, shift.ScheduleName, shift.Timestamp, shift.Duration, shift.Username];
  database.executeQuery('INSERT INTO OVERRIDE_SHIFT SET TeamID = ?, ScheduleName = ?, Timestamp = ?, Duration = ?, Username = ?', insertParams, (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(String(rows.insertId));
    }
  });
}

/**
* Service for updating an existing override shift
* Params: shift object
* Returns: None
*/
var updateOverrideShift = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var shift = req.body;
  var insertParams = [shift.TeamID, shift.ScheduleName, shift.Timestamp, shift.Duration, shift.Username, shift.ID];
  database.executeQuery('UPDATE OVERRIDE_SHIFT SET TeamID = ?, ScheduleName = ?, Timestamp = ?, Duration = ?, Username = ? WHERE ID = ?', insertParams, (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(String(rows.insertId));
    }
  });
}

/**
* Service for deleting an override shift
* Params: shift ID
* Returns: None
*/
var deleteOverrideShift = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('DELETE FROM OVERRIDE_SHIFT WHERE ID = ?', req.query.ID, (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send("success");
    }
  });
}

/**
* Service for creating a new manual shift
* Params: shift object
* Returns: ID of newly created shift
*/
var createManualShift = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var shift = req.body;
  var repeatType = repeatTypes.indexOf(shift.RepeatType);
  var insertParams = [shift.TeamID, shift.ScheduleName, shift.Timestamp, shift.Duration, shift.Username, shift.Repeated, repeatType];
  database.executeQuery('INSERT INTO MANUAL_SHIFT SET TeamID = ?, ScheduleName = ?, Timestamp = ?, Duration = ?, Username = ?, Repeated = ?, RepeatType = ?', insertParams, (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(String(rows.insertId));
    }
  });
}

/**
* Service for updating an existing manual shift
* Params: shift object
* Returns: None
*/
var updateManualShift = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var shift = req.body;
  var repeatType = repeatTypes.indexOf(shift.RepeatType);
  var insertParams = [shift.TeamID, shift.ScheduleName, shift.Timestamp, shift.Duration, shift.Username, shift.Repeated, repeatType, shift.ID];
  database.executeQuery('UPDATE MANUAL_SHIFT SET TeamID = ?, ScheduleName = ?, Timestamp = ?, Duration = ?, Username = ?, Repeated = ?, RepeatType = ? WHERE ID = ?', insertParams, (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send(String(rows.insertId));
    }
  });
}

/**
* Service for deleting an manual shift
* Params: shift ID
* Returns: None
*/
var deleteManualShift = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('DELETE FROM MANUAL_SHIFT WHERE ID = ?', req.query.ID, (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send("success");
    }
  });
}

/**
* Service for creating a new rotation shift
* Params: shift object
* Returns: ID of newly created shift
*/
var createRotationShift = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var shift = req.body;
  var repeatType = repeatTypes.indexOf(shift.RepeatType);
  var insertParams = [shift.TeamID, shift.ScheduleName, shift.Timestamp, shift.Duration, shift.Repeated, repeatType];
  var shiftID;
  var transaction = database.createTransaction();
  new Promise(function(resolve,reject) {
    database.executeQueryInTransaction('INSERT INTO ROTATION_SHIFT SET TeamID = ?, ScheduleName = ?, Timestamp = ?, Duration = ?, Repeated = ?, RepeatType = ?', transaction, insertParams, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        shiftID = rows.insertId;
        resolve();
      }
    });
  }).then(function() {
    var allUsersAdded = shift.Users.map(function(user) {
      return new Promise(function(resolve,reject) {
        database.executeQueryInTransaction('INSERT INTO USER_IN_ROTATION_SHIFT SET Username = ?, ShiftID = ?, Position = ?', transaction, [user.Username,shiftID,user.Position], (error, rows, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    });
    return Promise.all(allUsersAdded);
  }).then(function() {
    transaction.commit();
    res.statusCode = 200;
    res.send(String(shiftID));
  }).catch(function(error) {
    transaction.rollback();
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  });
}

/**
* Service for updating an existing rotation shift
* Params: shift object
* Returns: None
*/
var updateRotationShift = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var shift = req.body;
  var repeatType = repeatTypes.indexOf(shift.RepeatType);
  var insertParams = [shift.TeamID, shift.ScheduleName, shift.Timestamp, shift.Duration, shift.Repeated, repeatType, shift.ID];
  var transaction = database.createTransaction();
  new Promise(function(resolve,reject) {
    database.executeQueryInTransaction('UPDATE ROTATION_SHIFT SET TeamID = ?, ScheduleName = ?, Timestamp = ?, Duration = ?, Repeated = ?, RepeatType = ? WHERE ID = ?', transaction, insertParams, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  }).then(function() {
    return new Promise(function(resolve,reject) {
      database.executeQueryInTransaction('DELETE FROM USER_IN_ROTATION_SHIFT WHERE ShiftID = ?', transaction, shift.ID, (error, rows, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }).then(function() {
    var allUsersAdded = shift.Users.map(function(user) {
      return new Promise(function(resolve,reject) {
        database.executeQueryInTransaction('INSERT INTO USER_IN_ROTATION_SHIFT SET Username = ?, ShiftID = ?, Position = ?', transaction, [user.Username,shift.ID,user.Position], (error, rows, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    });
    return Promise.all(allUsersAdded);
  }).then(function() {
    transaction.commit();
    res.statusCode = 200;
    res.send("success");
  }).catch(function(error) {
    transaction.rollback();
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  });
}

/**
* Service for deleting a rotation shift
* Params: shift ID
* Returns: None
*/
var deleteRotationShift = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('DELETE FROM ROTATION_SHIFT WHERE ID = ?', req.query.ID, (error, rows, fields) => {
    if (error) {
      console.log(error)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      res.send("success");
    }
  });
}

module.exports = {
  getTeams : getTeams,
  createTeam : createTeam,
  getUsersOnTeam : getUsersOnTeam,
  updateUsersOnTeam : updateUsersOnTeam,
  createSchedule : createSchedule,
  deleteSchedule : deleteSchedule,
  getSchedules : getSchedules,
  getSchedulesForTeamByID : getSchedulesForTeamByID,
  getSchedulesForTeam : getSchedulesForTeam,
  createOverrideShift : createOverrideShift,
  updateOverrideShift : updateOverrideShift,
  deleteOverrideShift : deleteOverrideShift,
  createManualShift : createManualShift,
  updateManualShift : updateManualShift,
  deleteManualShift : deleteManualShift,
  createRotationShift : createRotationShift,
  updateRotationShift : updateRotationShift,
  deleteRotationShift : deleteRotationShift
}