var database = require('../database/database.js');

var searchAll = function(searchTerm) {
  return Promise.all([searchPings(searchTerm),searchServices(searchTerm),searchTeams(searchTerm)]).then((results)=>{
    var pings = results[0].map((ping)=>{return {
      type : "Ping",
      value : ping.ID,
      label : ping.Name
    }});
    var services = results[1].map((service)=>{return {
      type : "Service",
      value : service.Name,
      label : service.Name
    }});
    var teams = results[2].map((team)=>{return {
      type : "Team",
      value : team.Name,
      label : team.Name
    }});
    return pings.concat(services,teams);
  })
}

var searchPings = function(searchTerm) {
  var searchQuery = 'SELECT p.ID, p.Name FROM PING p ' +
    ' WHERE (p.ID=?) OR (p.Name LIKE ?) OR (p.Description LIKE ?) ';
  var likeString = "%" + searchTerm + "%";
  return new Promise((resolve,reject)=>{
    database.executeQuery(searchQuery, [searchTerm,likeString,likeString], (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      } 
    })
  });
}

var searchServices = function(searchTerm) {
  var searchQuery = 'SELECT s.ID, s.Name FROM SERVICE s ' +
    ' WHERE (s.Name LIKE ?) ';
  var likeString = "%" + searchTerm + "%";
  return new Promise((resolve,reject)=>{
    database.executeQuery(searchQuery, likeString, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      } 
    })
  });
}

var searchTeams = function(searchTerm) {
  var searchQuery = 'SELECT t.ID, t.Name FROM TEAM t ' +
    ' WHERE (t.Name LIKE ?) ';
  var likeString = "%" + searchTerm + "%";
  return new Promise((resolve,reject)=>{
    database.executeQuery(searchQuery, likeString, (error, rows, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      } 
    })
  });
}

module.exports = {
    searchAll : searchAll,
    searchPings : searchPings,
    searchServices : searchServices,
    searchTeams : searchTeams
}