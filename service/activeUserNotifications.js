var database = require('../database/database.js');

var createActiveUserNotification = function(username, pingID) {
  return new Promise((resolve,reject)=>{
    database.executeQuery('INSERT INTO ACTIVE_USER_NOTIFICATION SET Username=?, PingID=? ', [username,pingID], (error, rows, fields) => {
      if (error) reject(error);
      else resolve();
    });
  })

}

var deleteActiveUserNotificationsForPing = function(pingID) {
  return new Promise((resolve,reject)=>{
    database.executeQuery('DELETE FROM ACTIVE_USER_NOTIFICATION WHERE PingID=?', pingID, (error, rows, fields) => {
      if (error) reject(error);
      else resolve();
    });
  })
}

var getActiveNotificationsForUser = function(username) {
  return new Promise((resolve,reject)=>{
    database.executeQuery('SELECT * FROM ACTIVE_USER_NOTIFICATION WHERE Username=?', username, (error, rows, fields) => {
      if (error) reject(error);
      else resolve(rows);
    });
  })
}

module.exports = {
  createActiveUserNotification : createActiveUserNotification,
  deleteActiveUserNotificationsForPing : deleteActiveUserNotificationsForPing,
  getActiveNotificationsForUser : getActiveNotificationsForUser
}