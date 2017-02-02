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


app.get('/api/slackexample', function(req, res) {
  console.log('received request to ping slack');
  
  slack.postMessage('/services/T25EFUYP7/B3X4YAHUL/JLLTip8VjuNdkauvMRkMim9a', 'Example Slack Message');

  res.send("Slack message sent successfully.");
});

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
app.post('/api/services/updateEscalationPolicy', services.updateEscalationPolicy);

var pings = require('./rest/pings');
app.get('/api/pings/getPingsByServiceID', pings.getPingsByServiceID);



let example_pings = {
  1: 'Processing time degraded...', 
  2: 'Power outage on...', 
  3: 'Y2K took down...'
}
Object.values = obj => Object.keys(obj).map(key => obj[key]);

app.get('/api/pings', function(req, res) {
  res.send(Object.values(example_pings));
});

app.get('/api/schedule', function(req, res) {
  res.send([
      { date: '26 January 2017', name: 'Sam', time: '8:00am-8:00pm' },
      { date: '26 January 2017', name: 'Jo', time: '8:00pm-8:00am' },
      { date: '27 January 2017', name: 'Chris', time: '8:00am-8:00pm' },
      { date: '27 January 2017', name: 'Zach', time: '8:00pm-8:00am' },
      { date: '28 January 2017', name: 'HoKeun', time: '8:00am-8:00pm' },
    ])
})

app.get('/api/services/:service/pings', function(req, res) {
  console.log('inside pings api')
  const data = [
    {
      createdAt: '26 January 2017',
      description: 'Servers down',
      status: 'open'
    },
    {
      createdAt: '23 January 2017',
      description: 'UI not working',
      status: 'open'
    },
    {
      createdAt: '22 January 2017',
      description: 'Something broke',
      status: 'closed'
    }
  ]
  res.send(data)
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


app.post('/api/pings', function(req, res) {
  console.log('posting to pings');
  //add to database
  const id = req.body.id;
  const ping = req.body.ping;
  console.log('id: ' + id);
  console.log('ping: ' + ping)
  pings[id] = ping;
  res.send('successfully posted ping')
});



//last one for page refresh
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
});

const server = app.listen(8080, function () {
  const host = server.address().address
  const port = server.address().port
  console.log(server.address())
  console.log(host);
  console.log(port);
  console.log("Lion Ping app listening at http://%s:%s", host, port)
})
