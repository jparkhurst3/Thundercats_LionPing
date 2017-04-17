var database = require('../database/database.js');

/**
* Service for getting names of all services
* Params: None
* Returns: Names of services
*/
var getNames = function() {
  return new Promise((resolve,reject)=>{
    database.executeQuery('SELECT * FROM SERVICE', (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        const serviceNames = rows.map((row) => row['Name']);
        resolve(serviceNames);
      }
    })
  });
};

/**
* Service for getting names and IDs of all services
* Params: None
* Returns: Names of services
*/
var getServices = function() {
  return new Promise((resolve,reject)=>{
    database.executeQuery('SELECT * FROM SERVICE', (error, rows, fields) => {
      if (error) {
        reject(error);       
      } else {       
        resolve(rows);
      }
    })
  }); 
};

/**
* Service for creating a new service
* Params: Name
* Returns: ID of newly created service
*/
var createService = function(name) {

  var createServicePromise = new Promise(function(resolve,reject) {
    database.executeQuery('INSERT INTO SERVICE SET Name=?', name, (error, rows, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {
        resolve(rows.insertId);
      }
    })
  });
  return createServicePromise;
}

/**
* Get escalation policy linked to a specific service
* Params: Service ID or Name
* Returns Escalation Policy
*/
var getEscalationPolicy = function(nameOrID, queryParam) {

  var whereClause = (nameOrID == "ID") ? " WHERE (s.ID = ?)" : " WHERE (s.Name = ?)";

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

  return Promise.all([usersLoaded,schedulesLoaded]).then(function(val) {
    policy.Layers.sort((a,b)=>{
      return (a.Level - b.Level);
    })
    return policy;
  });
  
} 

/**
* Service for creating a new service
* Params: Name
* Returns: ID of newly created service
*/
var updateEscalationPolicy = function(escalationPolicy) {
  var transaction = database.createTransaction();

  var updateEscalationPolicyPromise = new Promise(function(resolve,reject) {
    database.executeQueryInTransaction('DELETE FROM ESCALATION_LEVEL WHERE (ServiceID = ?)', transaction, escalationPolicy.ID, (error,rows,fields) => {
      if (error) reject(error);
      else resolve();
    });
  }).then(() => {
    var insertAllLevels = escalationPolicy.Layers.map(function(layer) {
      return new Promise((resolve,reject) => {
        database.executeQueryInTransaction('INSERT INTO ESCALATION_LEVEL SET ServiceID = ?, Level = ?, Delay = ?', transaction, [escalationPolicy.ID,layer.Level,layer.Delay], (error,rows,fields) => {
          if (error) reject(error);
          else resolve();
        });
      });
    });
    return Promise.all(insertAllLevels);
  }).then(() => {
    var insertAllUserInEscalation = escalationPolicy.Layers.reduce(function(partial, layer) {
      return partial.concat(layer.Users.map(function(user) {
        return new Promise((resolve,reject) => {
          database.executeQueryInTransaction('INSERT INTO USER_IN_ESCALATION_LEVEL SET Username = ?, ServiceID = ?, Level = ?', transaction, [user.Username,escalationPolicy.ID,layer.Level], (error,rows,fields) => {
            if (error) reject(error);
            else resolve();
          });
        });
      }));
    }, []);
    return Promise.all(insertAllUserInEscalation);
  }).then(() => {   
    var insertAllSchedulesInEscalation = escalationPolicy.Layers.reduce(function(partial, layer) {
      return partial.concat(layer.Schedules.map(function(schedule) {
        return new Promise((resolve,reject) => {
          database.executeQueryInTransaction('INSERT INTO SCHEDULE_IN_ESCALATION_LEVEL SET TeamID = ?, Name = ?, ServiceID = ?, Level = ?', transaction, [schedule.TeamID,schedule.ScheduleName,escalationPolicy.ID,layer.Level], (error,rows,fields) => {
            if (error) reject(error);
            else resolve();
          });
        });
      }));
    }, []);
    return Promise.all(insertAllSchedulesInEscalation);
  }).then(() => {
    transaction.commit();
  }).catch((error)=> {
    transaction.rollback();
    throw error;
  });
  return updateEscalationPolicyPromise;

}

var getServicesForUser = function(username) {
  var query = "SELECT * FROM SERVICE WHERE (ID IN " + 
  " (SELECT DISTINCT(s.ID) from SERVICE s " +
  " JOIN ESCALATION_LEVEL el ON (s.ID = el.ServiceID) " +
  " JOIN USER_IN_ESCALATION_LEVEL u ON (el.ServiceID = u.ServiceID AND el.Level = u.Level) " +
  " WHERE u.Username=?)) " +
  " OR (ID IN " +
  " (SELECT DISTINCT(s.ID) from SERVICE s " +
  " JOIN ESCALATION_LEVEL el ON (s.ID = el.ServiceID) " +
  " JOIN SCHEDULE_IN_ESCALATION_LEVEL sel ON (el.ServiceID = sel.ServiceID AND el.Level = sel.Level) " +
  " JOIN USER_IN_TEAM t ON (t.TeamID = sel.TeamID) " +
  " WHERE t.Username=?)) ";

  return new Promise((resolve,reject)=> {
    database.executeQuery(query, [username,username], (error, rows, fields) => {
      if (error) {
        reject(error);       
      } else {       
        resolve(rows);
      }
    })
  });
}

module.exports = {
  getNames : getNames,
  getServices : getServices,
  createService : createService,
  getEscalationPolicy : getEscalationPolicy,
  updateEscalationPolicy : updateEscalationPolicy,
  getServicesForUser : getServicesForUser
}