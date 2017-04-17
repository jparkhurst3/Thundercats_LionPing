var serviceService = require('../service/services.js');

/**
* Service for getting names of all services
* Params: None
* Returns: Names of services
*/
var getNames = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  serviceService.getNames().then((serviceNames)=>{
    res.statusCode = 200;
    res.send(JSON.stringify(serviceNames));
  }).catch((error)=>{
    console.log(error)
    res.statusCode = 500;
    res.end("error");
  });
};

/**
* Service for getting names and IDs of all services
* Params: None
* Returns: Names of services
*/
var getServices = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  serviceService.getServices().then((services)=>{
    res.statusCode = 200;
    res.send(JSON.stringify(services));
  }).catch((error)=>{
    console.log(error)
    res.statusCode = 500;
    res.end("error");
  });
};

/**
* Service for creating a new service
* Params: Name
* Returns: ID of newly created service
*/
var createService = function(req, res) {

  res.setHeader('Content-Type', 'text/plain');
  serviceService.createService(req.body.Name).then((serviceID)=>{
    res.statusCode = 200;
    res.send(JSON.stringify(serviceID));
  }).catch((error)=>{
    console.log(error);
    res.statusCode = 500;
    res.send("Error getting escalation policy");
  });
}

/**
* Get escalation policy linked to a specific service
* Params: Service ID or Name
* Returns Escalation Policy
*/
var getEscalationPolicy = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  var nameOrID = (req.query.ID) ? "ID" : "Name";
  var queryParam = (req.query.ID) ? req.query.ID : req.query.Name;
  serviceService.getEscalationPolicy(nameOrID, queryParam).then((escalationPolicy) => {
    res.statusCode = 200;
    res.send(JSON.stringify(escalationPolicy));
  }).catch((error) => {
    console.log(error);
    res.statusCode = 500;
    res.send("Error getting escalation policy");
  });
} 

/**
* Service for creating a new service
* Params: Name
* Returns: ID of newly created service
*/
var updateEscalationPolicy = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  serviceService.updateEscalationPolicy(req.body).then(() => {
    res.statusCode = 200;
    res.send("Successfully updated escalation policy");
  }).catch((error) => {
    console.log(error);
    res.statusCode = 500;
    res.send("Error updating escalation policy");
  });

}

var getMyServices = function(req, res) {
  serviceService.getServicesForUser(req.user.Username).then((services)=>{
    res.statusCode = 200;
    res.send(JSON.stringify(services));
  }).catch((error)=>{
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  });
}

module.exports = {
  getNames : getNames,
  getServices : getServices,
  createService : createService,
  getEscalationPolicy : getEscalationPolicy,
  updateEscalationPolicy : updateEscalationPolicy,
  getMyServices : getMyServices
}