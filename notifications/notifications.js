var slack = require('./slack/slack.js');
var moment = require('moment');
var twilio = require('twilio');
var config = require('config');
var userService = require('../service/users.js');
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: config.email.auth
});

var notifyUser = function(username, message) {
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
	}).catch((error)=>{
		console.log("error notifying user " + username +": ");
		console.log(error);
	});
}

var sendText = function(number, message) {
	// var accountSid = 'AC25242c1a6c1f8c6792ffbe3fd2571264'; // Your Account SID from www.twilio.com/console
	// var authToken = '70607d01451bd9d277dc0d8d8d763abc';   // Your Auth Token from www.twilio.com/console
	var twilioConfig = config.get('twilio');
	var client = new twilio.RestClient(twilioConfig.accountSid, twilioConfig.authToken);

	client.messages.create({
	    body: message,
	    to: number,  // Text this number
	    from: twilioConfig.phoneNumber// From a valid Twilio number
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

var call = function(number, message) {
	console.log("calling " + number + " with message: " + message);
}

var notifySchedule = function(schedule, message) {
	// console.log(schedule);
	// console.log("notifying user: " + getOnCallUser(schedule));
	//get user currently on call for schedule
	var user = getOnCallUser(schedule);
	// console.log("user: " + user);
	if (user) {
		notifyUser(user,message);
	} else {
		console.log('no user on call for schedule');
	}
	
	//notifyUser(user)
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
			

module.exports = {
	notifyUser : notifyUser,
	notifySchedule : notifySchedule,
	sendText : sendText
}