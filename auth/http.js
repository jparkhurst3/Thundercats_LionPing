var userService = require('../service/users.js');

var isLoggedIn = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  if (req.user == undefined) {
    res.statusCode = 400;
    res.send(false);
  } else {
    res.statusCode = 200;
    res.send(true);
  }
}

var getCurrentUser = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  if (req.user == undefined) {
    res.statusCode = 400;
    res.send(false);
  } else {
    res.statusCode = 200;
    userService.getUser(req.user.Username).then((user)=>{
      res.send(user);
    }).catch((error)=>{
      res.statusCode = 400;
      res.send("invalid user session");
      req.logout();
    });
  }  
}

var login = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;
  var result = {
    success : true
  }
  res.send(JSON.stringify(result));
}

var logout = function(req, res) {
  req.logout();
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;
  res.send("logged out");
}

module.exports = {
    isLoggedIn : isLoggedIn,
    getCurrentUser : getCurrentUser,
    login : login,
    logout : logout
}