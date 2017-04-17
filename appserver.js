var debug = process.env.NODE_ENV !== "production";

var express = require('express');
var app = express();
var mysql = require('mysql');
var fs = require("fs");
var path = require('path');
var bodyParser = require('body-parser');

var database = require('./database/database.js');

var slack = require('./notifications/slack/slack.js');

//support parsing of application/json type post data
app.use(bodyParser.json());

app.use(require('cookie-parser')());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

//middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField : 'Username',
    passwordField : 'Password'
  },
  function(username, password, done) {
    console.log('login');
    database.executeQuery("SELECT Username, Password FROM USER WHERE (Username=?)", username, (err, rows, fields) => {
      if (err) {
        console.log("error");
        return done(err);
      }
      if (rows.length == 0) {
        console.log("user not found");
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (rows[0].Password != password) {
        console.log("incorrect password");
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("success");
      return done(null, rows[0]);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.Username);
});

passport.deserializeUser(function(username, cb) {
  database.executeQuery("SELECT Username, Password FROM USER WHERE (Username=?)", username, (err, rows, fields) => {
    if (err) { return cb(err); }
    return cb(null, rows[0]);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', require('connect-ensure-login').ensureLoggedIn());

app.use(express.static('build'));

var authServices = require('./auth/http.js');

app.post('/auth/login', passport.authenticate('local'), authServices.login);
app.get('/auth/logout', authServices.logout);
app.get('/auth/isLoggedIn', authServices.isLoggedIn);
app.get('/auth/getCurrentUser', authServices.getCurrentUser);

var twilioRest = require('./rest/twilioRest.js');
app.get('/twilio/getCallXML', twilioRest.getCallXML);
app.get('/twilio/postCallEvent', twilioRest.postCallEvent);

//api calls

//Import module from rest folder, put new modules for other entities in same folder in new module
var services = require('./rest/services');
//Link a url to a function from the created rest service layer module
app.get('/api/services/getNames', services.getNames);
app.get('/api/services/getServices', services.getServices);
app.post('/api/services/createService', services.createService);
app.get('/api/services/getEscalationPolicy', services.getEscalationPolicy)
app.post('/api/services/updateEscalationPolicy', services.updateEscalationPolicy);
app.get('/api/services/getMyServices', services.getMyServices);

//Pings
var pings = require('./rest/pings');
app.get('/api/pings/getPingsForService', pings.getPingsForService);
app.post('/api/pings/createPing', pings.createPing);
app.get('/api/pings/getPing', pings.getPing);
app.post('/api/pings/acknowledgePing', pings.acknowledgePing);
app.post('/api/pings/resolvePing', pings.resolvePing);

//Users
var users = require('./rest/users');
app.get('/api/users/getUsers', users.getUsers);
app.post('/api/users/createUser', users.createUser);
app.get('/api/users/getUser', users.getUser);
app.post('/api/users/updateUserNotificationPreferences', users.updateUserNotificationPreferences)

//Teams
var teams = require('./rest/teams');
app.get('/api/teams/getTeams', teams.getTeams);
app.post('/api/teams/createTeam', teams.createTeam);
app.get('/api/teams/getUsersOnTeam', teams.getUsersOnTeam);
app.post('/api/teams/updateUsersOnTeam', teams.updateUsersOnTeam);
app.post('/api/teams/createSchedule', teams.createSchedule);
app.post('/api/teams/deleteSchedule', teams.deleteSchedule);
app.get('/api/teams/getSchedules', teams.getSchedules);
app.get('/api/teams/getSchedulesForTeamByID', teams.getSchedulesForTeamByID);
app.get('/api/teams/getSchedulesForTeam', teams.getSchedulesForTeam);
app.post('/api/teams/createOverrideShift', teams.createOverrideShift);
app.post('/api/teams/updateOverrideShift', teams.updateOverrideShift);
app.post('/api/teams/deleteOverrideShift', teams.deleteOverrideShift);
app.post('/api/teams/createManualShift', teams.createManualShift);
app.post('/api/teams/updateManualShift', teams.updateManualShift);
app.post('/api/teams/deleteManualShift', teams.deleteManualShift);
app.post('/api/teams/createRotationShift', teams.createRotationShift);
app.post('/api/teams/updateRotationShift', teams.updateRotationShift);
app.post('/api/teams/deleteRotationShift', teams.deleteRotationShift);

var search = require('./rest/search.js');
app.get('/api/search/searchAll', search.searchAll);


var auth = require('./auth/http');

//All fake calls for frontend testing
app.get('/api/schedule', function(req, res) {
  res.send([
      { date: '26 January 2017', name: 'Sam', time: '8:00am-8:00pm' },
      { date: '26 January 2017', name: 'Jo', time: '8:00pm-8:00am' },
      { date: '27 January 2017', name: 'Chris', time: '8:00am-8:00pm' },
      { date: '27 January 2017', name: 'Zach', time: '8:00pm-8:00am' },
      { date: '28 January 2017', name: 'HoKeun', time: '8:00am-8:00pm' },
    ])
})


app.get('/api/users', function(req, res) {
  res.send([
    { label: 'Sam', value: 'Sam' },
    { label: 'Chris', value: 'Chris' },
    { label: 'Jo', value: 'Jo' },
    { label: 'Zach', value: 'Zach' },
    { label: 'HoKeun', value: 'HoKeun' },
  ])
})

app.get('/api/users/:id', function(req, res) {
  console.log(req.params.id);
  //go to database --- get user
  users = {
    1: 'Sam',
    2: 'Chris',
    3: 'Jo',
    4: 'Zach',
    5: 'Hokeun'
  }
  res.send(users[req.params.id])
});

//last one for page refresh
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
});

var port = (process.env.PORT || 8080);

const server = app.listen(port, function () {
  const host = server.address().address
  const port = server.address().port
  console.log(server.address())
  console.log(host);
  console.log(port);
  console.log("Lion Ping app listening at http://%s:%s", host, port)
})
