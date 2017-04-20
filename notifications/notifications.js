var slack = require('./slack/slack.js');
var moment = require('moment');
var config = require('config');
var twilio = require('twilio')(config.get('twilio').accountSid, config.get('twilio').authToken);
var userService = require('../service/users.js');
var pingService = require('../service/pings.js');
var serviceService = require('../service/services.js');
var teamService = require('../service/teams.js');
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: config.email.auth
});
var activeUserNotifications = require('../service/activeUserNotifications.js');

var notifyUser = function(username, pingID) {
	var message = "ROAR!!! Go to the following url to acknowledge the ping: " + config.url + "/pings/" + pingID;
	//get user notification preferences
	//use appropriate notification tool to send notification
	userService.getUser(username).then((user)=>{
		console.log(user);
		if(user.NotifyText) {
			sendText(user.Phone,message);
		}
		if(user.NotifyCall) {
			call(user.Phone,message);
		}
		if(user.NotifyEmail) {
			sendEmail(user.Email,message);
		}
		if(user.NotifySlack) {
			sendSlack(user.Slack, message)
		}
		activeUserNotifications.createActiveUserNotification(username, pingID);
	}).catch((error)=>{
		console.log("error notifying user " + username +": ");
		console.log(error);
	});
}

var sendText = function(number, message) {
	// var client = new twilio.RestClient(twilioConfig.accountSid, twilioConfig.authToken);

	twilio.messages.create({
	    body: message,
	    to: number,  // Text this number
	    from: config.get('twilio').phoneNumber// From a valid Twilio number
	}, function(err, message) {
	  if (err) {
	    console.log(err);

	  } else {
	    console.log(message.sid);
	  }
	});
}

var sendEmail = function(email, message) {
	// setup email data with unicode symbols
	let mailOptions = {
	    from: '"Lion Ping" <' + config.email.auth.user + '>', // sender address
	    to: email, // list of receivers
	    subject: 'Notification From Lion Ping', // Subject line
	    text: message, // plain text body
	    // html: '<b>Hello world ?</b>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    console.log('Message %s sent: %s', info.messageId, info.response);
	});
}

var sendSlack = function(slackname, message) {
	new_message = '<@' + slackname + '> ' + message;
	slack.postMessage(config.slack.webhookURL, new_message);
}

var call = function(number, message) {
	twilio.calls.create({
		url: config.get('twilio').callURL + "/twilio/getCallXML",
		to:number,
		from:config.get('twilio').phoneNumber,
		method:"GET",
		statusCallback: config.get('twilio').callURL + "/twilio/postCallEvent",
	    statusCallbackMethod: "POST",
	    statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
	}, function(err, call) {
		console.log("call error:");
		console.log(err);
		console.log(call);
	})
	console.log("calling " + number + " with message: " + message);
}

var notifySchedule = function(schedule, pingID) {
	//get user currently on call for schedule
	var user = getOnCallUser(schedule);
	if (user) {
		notifyUser(user,pingID);
	} else {
		console.log('no user on call for schedule');
	}
}

var getOnCallUser = function(schedule) {
	var overrideShift = schedule.OverrideShifts.find(function(shift) {
		var startTime = moment(shift.Timestamp);
		var endTime = startTime.clone().add(shift.Duration,'minutes');
		var currentTime = moment();
		return currentTime.isBetween(startTime,endTime);
	});

	if (overrideShift) return overrideShift.Username;

	var manualShift = schedule.ManualShifts.find(function(shift) {
		var startTime = getRelevantRepeatedShiftMoment(shift);
		var endTime = startTime.clone().add(shift.Duration,'minutes');
		var currentTime = moment();
		return currentTime.isBetween(startTime,endTime);
	});

	if (manualShift) return manualShift.Username;

	var rotationShift = schedule.RotationShifts.find(function(shift) {
		var startTime = getRelevantRepeatedShiftMoment(shift);
		var endTime = startTime.clone().add(shift.Duration,'minutes');
		var currentTime = moment();
		return currentTime.isBetween(startTime,endTime);
	});

	if (rotationShift) return rotationShift.Users[0].Username;

	return undefined;
}

var getRelevantRepeatedShiftMoment = function(shift) {
	var startTime = moment(shift.Timestamp);
	var currentTime = moment();
	if (shift.Repeated) {
		startTime.year(currentTime.year());
		if (shift.RepeatType == "daily") {
			startTime.dayOfYear(currentTime.dayOfYear());
		} else {
			startTime.week(currentTime.week());
		}
	}
	return startTime;
}

var notifyService = function(serviceID, pingID) {
	serviceService.getEscalationPolicy('ID', serviceID).then((escalationPolicy)=>{
		notifyEscalationLevel(escalationPolicy, 0, pingID);
	}).catch((error)=>{
		console.log(error);
	});
}

var notifyEscalationLevel = function(escalationPolicy, currentLevel, pingID) {
	pingService.getPing(pingID).then((ping)=>{
		if (ping.Status != "Open")  {
			console.log("ping already acknowledged");
			return;
		}
		escalationPolicy.Layers[currentLevel].Users.forEach(function(user) {
				notifyUser(user.Username, pingID);
			});
		escalationPolicy.Layers[currentLevel].Schedules.forEach(function(schedule) {
			teamService.getSchedule(schedule.TeamID,schedule.ScheduleName).then((detailedSchedule)=>{
				notifySchedule(detailedSchedule, pingID);
			})
		});
		currentLevel++;
		if (escalationPolicy.Layers.length > currentLevel) {
			waitXMinutes(escalationPolicy.Layers[currentLevel].Delay).then(()=>{
				notifyEscalationLevel(escalationPolicy, currentLevel, pingID);
			});
		}
	});
}

var waitXMinutes = function(minutes) {
	return new Promise(function(resolve, reject) {
		setTimeout(resolve, 1000 * 60 * minutes);
	});
}

var notifyForPing = function(pingID) {
	pingService.getPing(pingID).then((ping)=>{
		notifyService(ping.ServiceID, pingID);
	}).catch((error)=>{
		console.log(error);
	});
}

module.exports = {
	notifyUser : notifyUser,
	notifySchedule : notifySchedule,
	sendText : sendText,
	notifyForPing : notifyForPing
}
