var pingService = require('../service/pings.js');


// https://www.twilio.com/docs/api/twiml/gather

var TwiML = "<Response>" +
                "<Say voice=\"alice\"> ROAR! This is a notification from Lion Ping! Please go to your dashboard to acknowledge this Ping! Have a nice Day. </Say>" + 
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