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
* Params: Service ID
* Returns Escalation Policy
*/
var getEscalationPolicyByID = function(req, res) {
  console.log(req.query.id)
	res.setHeader('Content-Type', 'text/plain');
	var getUsersInEscalation = "SELECT s.ID, s.Name, l.Level, l.Delay, u.Username, USER.FirstName, USER.LastName FROM SERVICE s " +
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
    ID : req.query.ID,
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
  TODO
  
  getEscalationPolicyByID
  getPingsByServiceId
  updateEscalationPolicy - updates the entire policy - not the layer

*/

module.exports = {
  getNames : getNames,
  getServices : getServices,
  createService : createService,
  getEscalationPolicyByID : getEscalationPolicyByID
}