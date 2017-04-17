var pingService = require('../service/pings.js');


// https://www.twilio.com/docs/api/twiml/gather

var TwiML = "<Response>" +
                "<Say voice=\"alice\"> This is a notification from Lion Ping! ROAR!!</Say>" + 
            "</Response>";
var getCallXML = function(req, res) {
  res.setHeader('Content-Type', 'text/xml');
  res.statusCode = 200;
  res.end(TwiML);
}

var postCallEvent = function(req, res) {
  console.log("call event:");
  console.log(req.body);
}

module.exports = {
	getCallXML : getCallXML,
	postCallEvent : postCallEvent,
}