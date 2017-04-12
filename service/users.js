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
        resolve(rows);
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
        var user = rows[0];
        user.Password = undefined;
        resolve(user);
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
    database.executeQuery('UPDATE USER SET Email=?, Phone=?, Slack=?, NotifyEmail=?, NotifyCall=?, NotifyText=?, NotifySlack=? WHERE Username=? ', [user.Email,user.Phone,user.Slack,user.NotifyEmail,user.NotifyCall,user.NotifyText,user.NotifySlack,user.Username], (error, rows, fields) => {
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
