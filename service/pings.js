var database = require('../database/database.js');

var getPingsForService = function(nameOrID, queryParam) {
	var whereClause = (nameOrID == "ID") ? " WHERE (s.ID = ?)" : " WHERE (s.Name = ?)";

  return new Promise((resolve,reject)=>{
    database.executeQuery('SELECT p.ID, p.ServiceID, p.Name, p.Description, p.Status, p.CreatedTime FROM PING p JOIN SERVICE s ON (p.ServiceID = s.ID) ' + whereClause, queryParam, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    })
  });
}

var createPing = function(newPing) {
  return new Promise((resolve,reject)=>{
    database.executeQuery('INSERT INTO PING SET ServiceID = ?, Name = ?, Description = ?, Status = "Open"', [newPing.ServiceID,newPing.Name,newPing.Description], (error, rows, fields) => {
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

var acknowledgePing = function(ID) { //acknowledge ping by id
  return new Promise((resolve,reject)=>{
    database.executeQuery('UPDATE PING SET Status = "Acknowledged", AcknowledgedTime=NOW() WHERE ID=?', ID, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve("success");
      }
    })
  });
}

var resolvePing = function(ID) { //resolve ping by id
  return new Promise((resolve,reject)=>{
    database.executeQuery('UPDATE PING SET Status = "Resolved", ResolvedTime=NOW() WHERE ID=?', ID, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve("success");
      }
    })
  });
}

module.exports = {
	getPingsForService : getPingsForService,
	createPing : createPing,
  getPing : getPing,
  resolvePing : resolvePing,
  acknowledgePing : acknowledgePing
}