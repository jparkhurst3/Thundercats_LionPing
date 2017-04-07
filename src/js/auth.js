import axios from 'axios'

var loggedIn = false;

var isLoggedIn = function() {
  return new Promise((resolve,reject)=>{
    axios.get('/auth/logout')
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          reject(false);
        })
  })
}

var getCurrentUser = function() {
  return new Promise((resolve,reject)=>{
    axios.get('/auth/getCurrentUser')
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        })
  })
}

var login = function(username,password) {
  return new Promise((resolve,reject)=>{
    var user = {Username: username, Password: password};
    axios.post('/auth/login', user)
        .then(res => {
          resolve(true);
          loggedIn = true;
        })
        .catch(err => {
          reject(err);
        })
  })
  
}

var logout = function() {
  return new Promise((resolve,reject)=>{
    axios.get('/auth/logout')
        .then(res => {
          resolve(true);
          loggedIn = false;
        })
        .catch(err => {
          reject(err);
        })
  })
}

module.exports = {
    loggedIn : loggedIn,
    isLoggedIn : isLoggedIn,
    getCurrentUser : getCurrentUser,
    login : login,
    logout : logout
}