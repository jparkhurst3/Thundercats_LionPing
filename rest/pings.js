var pingService = require('../service/pings.js');
var notifications = require('../notifications/notifications');

var getPingsForService = function(req, res) {

	var nameOrID = (req.query.ID) ? "ID" : "Name";
  var queryParam = (req.query.ID) ? (req.query.ID) : (req.query.Name);

  res.setHeader('Content-Type', 'text/plain');

  pingService.getPingsForService(nameOrID,queryParam).then((pings)=>{
    res.statusCode = 200;
    res.send(JSON.stringify(pings));
  }).catch((error)=>{
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  });
}

var createPing = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  pingService.createPing(req.body).then((pingID)=>{
    res.statusCode = 200;
    res.send(JSON.stringify(pingID));
    notifications.notifyForPing(pingID);
  }).catch((error)=>{
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  });
}

var getPing = function(req, res) { //get ping by id
  res.setHeader('Content-Type', 'text/plain');

  pingService.getPing(req.query.ID).then((ping)=>{
    res.statusCode = 200;
    res.send(JSON.stringify(ping));
  }).catch((error)=>{
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  });
}

var acknowledgePing = function(req, res) { //acknowledge ping by id
  res.setHeader('Content-Type', 'text/plain');

  pingService.acknowledgePing(req.query.ID, req.user.Username).then(()=>{
    res.statusCode = 200;
    res.send("success");
  }).catch((error)=>{
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  });
}

var resolvePing = function(req, res) { //resolve ping by id
  res.setHeader('Content-Type', 'text/plain');

  pingService.resolvePing(req.query.ID, req.user.Username).then(()=>{
    res.statusCode = 200;
    res.send("success");
  }).catch((error)=>{
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  });
}

module.exports = {
	getPingsForService : getPingsForService,
	createPing : createPing,
  getPing : getPing,
  resolvePing : resolvePing,
  acknowledgePing : acknowledgePing
}