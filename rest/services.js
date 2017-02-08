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
* Service for getting names and IDs of all services
* Params: None
* Returns: Names of services
*/
var getServices = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('SELECT * FROM SERVICE', (error, rows, fields) => {
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
* Service for creating a new service
* Params: Name
* Returns: ID of newly created service
*/
var createService = function(req, res) {
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
* Get escalation policy linked to a specific service
* Params: Service ID or Name
* Returns Escalation Policy
*/
var getEscalationPolicy = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  var whereClause = (req.query.ID) ? " WHERE (s.ID = ?)" : " WHERE (s.Name = ?)";
  var queryParam = (req.query.ID) ? (req.query.ID) : (req.query.Name);

  var getUsersInEscalation = "SELECT s.ID, s.Name, l.Level, l.Delay, USER.Username, USER.FirstName, USER.LastName FROM SERVICE s " +
    " LEFT OUTER JOIN ESCALATION_LEVEL l ON (s.ID = l.ServiceID) " +
    " LEFT OUTER JOIN USER_IN_ESCALATION_LEVEL u ON (l.ServiceID = u.ServiceID AND l.Level = u.Level) " +
    " LEFT OUTER JOIN USER ON (USER.Username = u.Username) " + whereClause;

  var getSchedulesInEscalation = "SELECT s.ID, s.Name, l.Level, l.Delay, t.Name as TeamName, t.ID as TeamID, sched.Name as ScheduleName FROM SERVICE s " +
    " JOIN ESCALATION_LEVEL l ON (s.ID = l.ServiceID) " +
    " JOIN SCHEDULE_IN_ESCALATION_LEVEL s_in ON (s_in.ServiceID = l.ServiceID AND s_in.Level = l.Level) " +
    " JOIN SCHEDULE sched ON (sched.TeamID = s_in.TeamID AND sched.Name = s_in.Name) " +
    " JOIN TEAM t on (t.ID = sched.TeamID) " + whereClause;

  

  var policy = {
    Layers : []
  }

  var usersLoaded = new Promise(function(resolve, reject) {
    database.executeQuery(getUsersInEscalation, queryParam, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        policy.ID = rows[0].ID;
        policy.Name = rows[0].Name;

        rows.forEach(function(row) {
          if (row.Level == null) return;

          var layer = policy.Layers.find(function(value) {
            return (value.Level == row.Level);
          });

          if (layer === undefined) {
            layer = {
              Level : row.Level,
              Delay : row.Delay,
              Users : [],
              Schedules : []
            }
            policy.Layers.push(layer);
          }

          if (row.Username) {
            layer.Users.push({
              Username : row.Username,
              FirstName : row.FirstName,
              LastName : row.LastName
            });  
          }
              
        });
        
        resolve();
      }
    });
  });

  var schedulesLoaded = new Promise(function(resolve, reject) {
    database.executeQuery(getSchedulesInEscalation, queryParam, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        rows.forEach(function(row) {
          var layer = policy.Layers.find(function(value) {
            return (value.Level == row.Level);
          });

          if (layer === undefined) {
            layer = {
              Level : row.Level,
              Delay : row.Delay,
              Users : [],
              Schedules : []
            }
            policy.Layers.push(layer);
          }

          layer.Schedules.push({
            TeamID : row.TeamID,
            TeamName : row.TeamName,
            ScheduleName : row.ScheduleName
          });      
        });
        resolve();
      }
    });
  });

  Promise.all([usersLoaded,schedulesLoaded]).then(function(val) {
    res.statusCode = 200;
    res.end(JSON.stringify(policy));
  }).catch(function(error) {
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  }); 
  
} 

/**
* Get escalation policy linked to a specific service
* Params: Service ID
* Returns Escalation Policy
*/
var getEscalationPolicyByID = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	var getUsersInEscalation = "SELECT s.ID, s.Name, l.Level, l.Delay, USER.Username, USER.FirstName, USER.LastName FROM SERVICE s " +
		" JOIN ESCALATION_LEVEL l ON (s.ID = l.ServiceID) " +
	  " JOIN USER_IN_ESCALATION_LEVEL u ON (l.ServiceID = u.ServiceID AND l.Level = u.Level) " +
    " JOIN USER ON (USER.Username = u.Username) " +
	  " WHERE (s.ID = ?)";

  var getSchedulesInEscalation = "SELECT s.ID, s.Name, l.Level, l.Delay, t.Name as TeamName, t.ID as TeamID, sched.Name as ScheduleName FROM SERVICE s " +
    " JOIN ESCALATION_LEVEL l ON (s.ID = l.ServiceID) " +
    " JOIN SCHEDULE_IN_ESCALATION_LEVEL s_in ON (s_in.ServiceID = l.ServiceID AND s_in.Level = l.Level) " +
    " JOIN SCHEDULE sched ON (sched.TeamID = s_in.TeamID AND sched.Name = s_in.Name) " +
    " JOIN TEAM t on (t.ID = sched.TeamID) " +
    " WHERE (s.ID = ?)";

  var policy = {
    Layers : []
  }

  var usersLoaded = new Promise(function(resolve, reject) {
    database.executeQuery(getUsersInEscalation, req.query.ID, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        rows.forEach(function(row) {
          var layer = policy.Layers.find(function(value) {
            return (value.Level == row.Level);
          });

          if (layer === undefined) {
            layer = {
              Level : row.Level,
              Delay : row.Delay,
              Users : [],
              Schedules : []
            }
            policy.Layers.push(layer);
          }

          layer.Users.push({
            Username : row.Username,
            FirstName : row.FirstName,
            LastName : row.LastName
          });      
        });
        if (rows.length > 0) {
          policy.ID = rows[0].ID;
          policy.Name = rows[0].Name;
        }
        resolve();
      }
    });
  });

  var schedulesLoaded = new Promise(function(resolve, reject) {
    database.executeQuery(getSchedulesInEscalation, req.query.ID, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        rows.forEach(function(row) {
          var layer = policy.Layers.find(function(value) {
            return (value.Level == row.Level);
          });

          if (layer === undefined) {
            layer = {
              Level : row.Level,
              Delay : row.Delay,
              Users : [],
              Schedules : []
            }
            policy.Layers.push(layer);
          }

          layer.Schedules.push({
            TeamID : row.TeamID,
            TeamName : row.TeamName,
            ScheduleName : row.ScheduleName
          });      
        });
        if (rows.length > 0) {
          policy.ID = rows[0].ID;
          policy.Name = rows[0].Name;
        }
        resolve();
      }
    });
  });

  Promise.all([usersLoaded,schedulesLoaded]).then(function(val) {
    res.statusCode = 200;
    res.end(JSON.stringify(policy));
  }).catch(function(error) {
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  }); 
	
} 

/**
* Service for creating a new service
* Params: Name
* Returns: ID of newly created service
*/
var updateEscalationPolicy = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  var transaction = database.createTransaction();

  new Promise(function(resolve,reject) {
    database.executeQueryInTransaction('DELETE FROM ESCALATION_LEVEL WHERE (ServiceID = ?)', transaction, req.body.ID, (error,rows,fields) => {
      if (error) reject(error);
      else resolve();
    });
  }).then(() => {
    var insertAllLevels = req.body.Layers.map(function(layer) {
      return new Promise((resolve,reject) => {
        database.executeQueryInTransaction('INSERT INTO ESCALATION_LEVEL SET ServiceID = ?, Level = ?, Delay = ?', transaction, [req.body.ID,layer.Level,layer.Delay], (error,rows,fields) => {
          if (error) reject(error);
          else resolve();
        });
      });
    });
    return Promise.all(insertAllLevels);
  }).then(() => {
    var insertAllUserInEscalation = req.body.Layers.reduce(function(partial, layer) {
      return partial.concat(layer.Users.map(function(user) {
        return new Promise((resolve,reject) => {
          database.executeQueryInTransaction('INSERT INTO USER_IN_ESCALATION_LEVEL SET Username = ?, ServiceID = ?, Level = ?', transaction, [user.Username,req.body.ID,layer.Level], (error,rows,fields) => {
            if (error) reject(error);
            else resolve();
          });
        });
      }));
    }, []);
    return Promise.all(insertAllUserInEscalation);
  }).then(() => {   
    var insertAllSchedulesInEscalation = req.body.Layers.reduce(function(partial, layer) {
      return partial.concat(layer.Schedules.map(function(schedule) {
        return new Promise((resolve,reject) => {
          database.executeQueryInTransaction('INSERT INTO SCHEDULE_IN_ESCALATION_LEVEL SET TeamID = ?, Name = ?, ServiceID = ?, Level = ?', transaction, [schedule.TeamID,schedule.ScheduleName,req.body.ID,layer.Level], (error,rows,fields) => {
            if (error) reject(error);
            else resolve();
          });
        });
      }));
    }, []);
    return Promise.all(insertAllSchedulesInEscalation);
  }).then(() => {
    transaction.commit();
    res.statusCode = 200;
    res.send("Successfully updated escalation policy");
  }).catch((error) => {
    transaction.rollback();
    console.log(error);
    res.statusCode = 500;
    res.send("Error updating escalation policy");
  });

}

module.exports = {
  getNames : getNames,
  getServices : getServices,
  createService : createService,
  getEscalationPolicyByID : getEscalationPolicyByID,
  getEscalationPolicy : getEscalationPolicy,
  updateEscalationPolicy : updateEscalationPolicy
}