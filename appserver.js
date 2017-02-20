var debug = process.env.NODE_ENV !== "production";

var express = require('express');
var app = express();
var mysql = require('mysql');
var fs = require("fs");
var path = require('path');
var bodyParser = require('body-parser');

var database = require('./database/database.js');

var slack = require('./slack/slack.js');

//middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('build'));

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//api calls

app.post('/api/slack', (req, res) => {
  slack.postMessage('/services/T25EFUYP7/B3X4YAHUL/JLLTip8VjuNdkauvMRkMim9a', req.body.description);
  console.log(req.body.description);
  res.end('successfully posted to slack')
})

//Import module from rest folder, put new modules for other entities in same folder in new module
var services = require('./rest/services');
//Link a url to a function from the created rest service layer module
app.get('/api/services/getNames', services.getNames);
app.get('/api/services/getServices', services.getServices);
app.post('/api/services/createService', services.createService);
app.get('/api/services/getEscalationPolicyByID', services.getEscalationPolicyByID);
app.get('/api/services/getEscalationPolicy', services.getEscalationPolicy)
app.post('/api/services/updateEscalationPolicy', services.updateEscalationPolicy);


//Pings
var pings = require('./rest/pings');
app.get('/api/pings/getPingsForService', pings.getPingsForService);
app.post('/api/pings/createPing', pings.createPing);

//Users
var users = require('./rest/users');
app.get('/api/users/getUsers', users.getUsers);

//Teams
var teams = require('./rest/teams');
app.get('/api/teams/getTeams', teams.getTeams);
app.post('/api/teams/createTeam', teams.createTeam);
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
