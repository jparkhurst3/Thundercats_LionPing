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

// /**
// * Get schedules linked to a specifc team
// * Params: Team ID
// * Returns: List of Schedules
// */
// var getSchedulesForTeam = function(req, res) {
//   res.setHeader('Content-Type', 'text/plain');

//   var whereClause = (req.query.ID) ? " WHERE (t.ID = ?)" : " WHERE (t.Name = ?)";
//   var queryParam = (req.query.ID) ? (req.query.ID) : (req.query.Name);

//   var getUsersInEscalation = "SELECT s.Name as ScheduleName FROM TEAM t " +
//     " JOIN SCHEDULE s ON (s.TeamID = t.ID) " + whereClause;

//   database.executeQuery(getUsersInEscalation, queryParam, (error, rows, fields) => {
//     if (error) {
//       console.log(error)
//       res.statusCode = 500;
//       res.end("error");
//     } else {
//       res.statusCode = 200;
//       res.send(JSON.stringify(rows));
//     }
//   })
// }

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

/**
* Get Schedules linked to a specific Team
* Params: Service ID or Name
* Returns Escalation Policy
*/
var getSchedulesForTeam = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  var whereClause = (req.query.ID) ? " WHERE (t.ID = ?)" : " WHERE (t.Name = ?)";
  var queryParam = (req.query.ID) ? (req.query.ID) : (req.query.Name);

  var getSchedules = "SELECT t.Name as TeamName, t.ID as TeamID, s.Name as ScheduleName FROM TEAM t " +
    " LEFT OUTER JOIN SCHEDULE s ON (s.TeamID = t.ID) " + whereClause;

  var getOverrideShifts = "SELECT ID, Timestamp, Duration, Username FROM OVERRIDE_SHIFT " +
    " WHERE (TeamID = ?) AND (ScheduleName = ?)";

  var getManualShifts = "SELECT ID, Timestamp, Duration, Username, Repeated, RepeatType FROM MANUAL_SHIFT " +
    " WHERE (TeamID = ?) AND (ScheduleName = ?)";

  var getRotationShifts = "SELECT ID, Timestamp, Duration, Repeated, RepeatType FROM ROTATION_SHIFT " +
    " WHERE (TeamID = ?) AND (ScheduleName = ?)";

  var getUsersInRotationShift = "SELECT Username, Position FROM USER_IN_ROTATION_SHIFT WHERE (ShiftID = ?) ";

  var teamSchedules = {
    Schedules : []
  }

  // var convertDaysByteToObj = function(daysByte) {
  //   return {
  //     Monday: (daysByte & 0x1) != 0,
  //     Tuesday: (daysByte & 0x2) != 0,
  //     Wednesday: (daysByte & 0x4) != 0,
  //     Thursday: (daysByte & 0x8) != 0,
  //     Friday: (daysByte & 0x10) != 0,
  //     Saturday: (daysByte & 0x20) != 0,
  //     Sunday: (daysByte & 0x40) != 0,
  //   };
  // }

  var repeatTypes = ["daily", "weekly"];

  new Promise(function(resolve, reject) {
    database.executeQuery(getSchedules,queryParam,(error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        teamSchedules.TeamName = rows[0].TeamName;
        teamSchedules.TeamID = rows[0].TeamID;
        teamSchedules.Schedules = rows.map((scheduleRow) => {
          return {
            ScheduleName:scheduleRow.ScheduleName,
            OverrideShifts:[],
            ManualShifts:[],
            RotationShifts:[]
          };
        });
        resolve();
      }
    });
  }).then(function() {
    var overrideShiftsLoaded = Promise.all(teamSchedules.Schedules.map(function(schedule) {
      return new Promise(function(resolve,reject) {
        database.executeQuery(getOverrideShifts,[teamSchedules.TeamID,schedule.ScheduleName],(error, rows, fields) => {
          if (error) {
            reject(error);
          } else {
            schedule.OverrideShifts = rows;
            resolve(rows);
          }
        });
      });
    }));
    var manualShiftsLoaded = Promise.all(teamSchedules.Schedules.map(function(schedule) {
      return new Promise(function(resolve,reject) {
        database.executeQuery(getManualShifts,[teamSchedules.TeamID,schedule.ScheduleName],(error, rows, fields) => {
          if (error) {
            reject(error);
          } else {
            rows.forEach(function(manualShift) {
              manualShift.Repeated = (manualShift.Repeated === 1);
              manualShift.RepeatType = repeatTypes[manualShift.RepeatType];
            });
            schedule.ManualShifts = rows;
            resolve(rows);
          }
        });
      });
    }));
    var rotationShiftsLoaded = Promise.all(teamSchedules.Schedules.map(function(schedule) {
      return new Promise(function(resolve,reject) {
        database.executeQuery(getRotationShifts,[teamSchedules.TeamID,schedule.ScheduleName],(error, rows, fields) => {
          if (error) {
            reject(error);
          } else {
            rows.forEach(function(rotationShift) {
              rotationShift.Repeated = (rotationShift.Repeated === 1);
              rotationShift.RepeatType = repeatTypes[rotationShift.RepeatType];
            });
            schedule.RotationShifts = rows;
            resolve(rows);
          }
        });
      }).then(function(rotationShifts) {
        var shiftUsersLoaded = rotationShifts.map(function(rotationShift) {
          return new Promise(function(resolve, reject) {
            database.executeQuery(getUsersInRotationShift,rotationShift.ID,(error, rows, fields) => {
              if (error) {
                reject(error);
              } else {
                rotationShift.Users = rows;
                resolve();
              }
            });
          });
        });
        return Promise.all(shiftUsersLoaded);
      });
    }));
    return Promise.all([overrideShiftsLoaded,manualShiftsLoaded,rotationShiftsLoaded]);
  }).then(() => {
    res.statusCode = 200;
    res.send(JSON.stringify(teamSchedules));
  }).catch((error) => {
    console.log(error);
    res.statusCode = 500;
    res.send("Error getting schedules for team.");
  });
} 

module.exports = {
  getTeams : getTeams,
  createTeam : createTeam,
  getSchedules : getSchedules,
  getSchedulesForTeamByID : getSchedulesForTeamByID,
  getSchedulesForTeam : getSchedulesForTeam
}