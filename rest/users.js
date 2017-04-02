var userService = require('../service/users.js');

/**
* Service for getting list of all users
* Params: None
* Returns: Username, First Name, Last Name of all users
*/
var getUsers = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  userService.getUsers().then(function(users) {
    res.statusCode = 200;
    res.send(users);
  }).catch(function(error) {
    console.log(error);
    res.statusCode = 500;
    res.end(error);
  });
};

/**
* Service for creating a new user
* Params: Name, Password, FirstName, LastName for new user
* Returns: ID of newly created user
*/
var createUser = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  userService.createUser(req.body).then(function(newUserID) {
    res.statusCode = 200;
    res.send(JSON.stringify(newUserID));
  }).catch(function(error) {
    console.log(error);
    res.statusCode = 500;
    res.end(error);
  });
};

var getUser = function(req,res) {
  res.setHeader('Content-Type', 'text/plain');
  userService.getUser(req.query.Username).then(function(user) {
    res.statusCode = 200;
    res.send(user);
  }).catch(function(error) {
    console.log(error);
    res.statusCode = 500;
    res.end(error);
  });
}

/**
* Service for updating user notification preferences
* Params: Username, NotifyEmail, NotifyCall, NotifyText
* Returns: none
*/
var updateUserNotificationPreferences = function(req,res) {
  res.setHeader('Content-Type', 'text/plain');
  userService.updateUserNotificationPreferences(req.body).then(function() {
    res.statusCode = 200;
    res.send("success");
  }).catch(function(error) {
    console.log(error);
    res.statusCode = 500;
    res.end(error);
  });
}


module.exports = {
  getUsers : getUsers,
  createUser : createUser,
  getUser : getUser,
  updateUserNotificationPreferences : updateUserNotificationPreferences
}