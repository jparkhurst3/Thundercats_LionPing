var debug = process.env.NODE_ENV !== "production";

var express = require('express');
var app = express();
var mysql = require('mysql');
var fs = require("fs");
var path = require('path');
var bodyParser = require('body-parser');

var database = require('./database/database.js');


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

// app.get('/api/services', function (req, res) {
//   res.setHeader('Content-Type', 'text/plain');
//   database.executeQuery('SELECT * FROM SERVICE', function(error, results, fields) {
//     if (error) {
//       console.log(error);
//       res.statusCode = 500;
//       res.end("error");
//     } else {
//       res.statusCode = 200;
//       var serviceNames = results.map(function(row) {
//         return row['Name'];
//       });
//       res.end(JSON.stringify(serviceNames));
//     }
//   });
// });

app.get('/api/services', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  database.executeQuery('SELECT * FROM SERVICE', (error, rows, fields) => {
    if (error) {
      console.log(err)
      res.statusCode = 500;
      res.end("error");
    } else {
      res.statusCode = 200;
      const serviceNames = rows.map((row) => row['Name']);
      res.send(JSON.stringify(serviceNames))
    }
  })
})

let pings = {
  1: 'Processing time degraded...', 
  2: 'Power outage on...', 
  3: 'Y2K took down...'
}
Object.values = obj => Object.keys(obj).map(key => obj[key]);

app.get('/api/pings', function(req, res) {
  res.send(Object.values(pings));
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
