var database = require('../database/database.js');

/**
* Service for getting list of all users
* Params: None
* Returns: Username, First Name, Last Name of all users
*/
var getUsers = function() {
  var getUsersPromise = new Promise(function(resolve,reject) {
    database.executeQuery('SELECT Username,FirstName,LastName FROM USER', (error, rows, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {
        resolve(JSON.stringify(rows));
      }
    })
  });
  return getUsersPromise;
};

/**
* Service for creating a new user
* Params: Name, Password, FirstName, LastName for new user
* Returns: ID of newly created user
*/
var createUser = function(user) {
  var createUserPromise = new Promise(function(resolve,reject) {
    database.executeQuery('INSERT INTO USER SET Username=?, Password=?, FirstName=?, LastName=?', [user.Username, user.Password, user.FirstName, user.LastName], (error, rows, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {
        resolve(rows.insertId);
      }
    })
  });
  return createUserPromise;
};

var getUser = function(Username) {
  var getUserPromise = new Promise(function(resolve,reject) {
    database.executeQuery('SELECT * FROM USER WHERE Username=? ', Username, (error, rows, fields) => {
      if (error || rows.length == 0) {
        console.log(error);
        reject(error);
      } else {
        resolve(JSON.stringify(rows[0]));
      }
    })
  });
  return getUserPromise;
}

/**
* Service for updating user notification preferences
* Params: Username, NotifyEmail, NotifyCall, NotifyText
* Returns: none
*/
var updateUserNotificationPreferences = function(user) {
  var updateUserNotificationPreferencesPromise = new Promise(function(resolve,reject) {
    database.executeQuery('UPDATE USER SET Email=?, Phone=?, NotifyEmail=?, NotifyCall=?, NotifyText=? WHERE Username=? ', [user.Email,user.Phone,user.NotifyEmail,user.NotifyCall,user.NotifyText,user.Username], (error, rows, fields) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve("success");
      }
    })
  });
  return updateUserNotificationPreferencesPromise;
}


module.exports = {
  getUsers : getUsers,
  createUser : createUser,
  getUser : getUser,
  updateUserNotificationPreferences : updateUserNotificationPreferences
}