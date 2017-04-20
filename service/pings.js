var database = require('../database/database.js');
var serviceServce = require('./services.js');
var activeUserNotifications = require('./activeUserNotifications.js');

var getPingsForService = function(nameOrID, queryParam, limit) {
	var whereClause = (nameOrID == "ID") ? " WHERE (s.ID = ?)" : " WHERE (s.Name = ?) ";
  var query = 'SELECT p.* FROM PING p JOIN SERVICE s ON (p.ServiceID = s.ID) ' + whereClause + 
   " ORDER BY FIELD(p.Status,'Open','Acknowledged','Resolved'), CreatedTime DESC ";
  if (limit) {
    query += " LIMIT " + limit;
  }
  return new Promise((resolve,reject)=>{
    database.executeQuery(query, queryParam, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    })
  });
}

var createPing = function(newPing, username) {
  return new Promise((resolve,reject)=>{
    database.executeQuery('INSERT INTO PING SET ServiceID = ?, Name = ?, Description = ?, Status = "Open", CreatedUser = ? ', [newPing.ServiceID,newPing.Name,newPing.Description,username], (error, rows, fields) => {
      if (error || rows.length == 0) {
        reject(error);
      } else {
        resolve(rows.insertId);
      }
    })
  });
}

var getPing = function(ID) { //get ping by id
  var getPingQuery = 'SELECT p.ID, p.ServiceID, s.Name as ServiceName, p.Name, p.Description, p.Status, p.CreatedTime, ' +
    ' p.CreatedUser, p.AcknowledgedUser, p.AcknowledgedTime, p.ResolvedUser, p.ResolvedTime ' +
    ' FROM PING p JOIN SERVICE s ON (s.ID = p.ServiceID) WHERE p.ID=? ';
  return new Promise((resolve,reject)=>{
    database.executeQuery(getPingQuery, ID, (error, rows, fields) => {
      if (error || rows.length == 0) {
        reject(error);
      } else {
        resolve(rows[0]);
      }
    })
  });
}

var acknowledgePing = function(ID, username) { //acknowledge ping by id
  return new Promise((resolve,reject)=>{
    database.executeQuery('UPDATE PING SET Status = "Acknowledged", AcknowledgedTime=NOW(), AcknowledgedUser=? WHERE ID=?', [username, ID], (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve("success");
        activeUserNotifications.deleteActiveUserNotificationsForPing(ID);
      }
    })
  });
}

var resolvePing = function(ID, username) { //resolve ping by id
  return new Promise((resolve,reject)=>{
    database.executeQuery('UPDATE PING SET Status = "Resolved", ResolvedTime=NOW(), ResolvedUser=? WHERE ID=?', [username, ID], (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve("success");
      }
    })
  });
}

var getUnresolvedPings = function() {
  return new Promise((resolve,reject)=>{
    database.executeQuery('SELECT * FROM PING WHERE Status != "Resolved" ', (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    })
  });
}

var getUnresolvedPingsForUser = function(username) {
  return new Promise((resolve,reject)=>{
    serviceServce.getServicesForUser(username).then((services)=>{
      if (services.length == 0) {
        resolve([]);
        return;
      }
      var serviceIDs = services.map((service)=>{ return service.ID; });
      var query = 'SELECT * FROM PING WHERE Status != "Resolved" AND ServiceID IN (' + serviceIDs.join(",") + ")";
      database.executeQuery(query, (error, rows, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  });
  
}

var getOpenPingsForUser = function(username) {
  return new Promise((resolve,reject)=>{
    activeUserNotifications.getActiveNotificationsForUser(username).then((activeUserNotifications)=>{
      if (activeUserNotifications.length == 0) {
        resolve([]);
        return;
      }
      var pingIDs = activeUserNotifications.map((activeUserNotification)=>{
        return activeUserNotification.PingID;
      });
      var query = "SELECT * FROM PING WHERE ID IN (" + pingIDs.join(",") + ")";
      database.executeQuery(query, (error, rows, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      })
    });
  });
}

var getPingsForUser = function(username, limit) {
  return new Promise((resolve,reject)=>{
    serviceServce.getServicesForUser(username).then((services)=>{
      if (services.length == 0) {
        resolve([]);
        return;
      }
      var serviceIDs = services.map((service)=>{ return service.ID; });
      var query = 'SELECT p.*, s.Name as ServiceName FROM PING p JOIN SERVICE s ON (p.ServiceID = s.ID) WHERE p.ServiceID IN (' + serviceIDs.join(",") + ") " +
        " ORDER BY FIELD(p.Status,'Open','Acknowledged','Resolved'), p.CreatedTime DESC ";
      if (limit) {
        query += " LIMIT " + limit;
      }
      database.executeQuery(query, (error, rows, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  });
}

var getAllPings = function(limit) {
  return new Promise((resolve,reject)=>{
    var query = 'SELECT p.*, s.Name as ServiceName FROM PING p JOIN SERVICE s ON (p.ServiceID = s.ID) ' +
      " ORDER BY FIELD(p.Status,'Open','Acknowledged','Resolved'), p.CreatedTime DESC ";
    if (limit) {
      query += " LIMIT " + limit;
    }
    database.executeQuery(query, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    })
  });
}

module.exports = {
	getPingsForService : getPingsForService,
	createPing : createPing,
  getPing : getPing,
  resolvePing : resolvePing,
  acknowledgePing : acknowledgePing,
  getUnresolvedPings : getUnresolvedPings,
  getUnresolvedPingsForUser : getUnresolvedPingsForUser,
  getOpenPingsForUser : getOpenPingsForUser,
  getPingsForUser : getPingsForUser,
  getAllPings : getAllPings
}