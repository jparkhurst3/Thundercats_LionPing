var slack = require('./slack/slack.js');
var moment = require('moment');
var twilio = require('twilio');
var config = require('config');

var notifyUser = function(username) {
	//get user notification preferences
	//use appropriate notification tool to send notification
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

var notifySchedule = function(schedule) {
	console.log(schedule);
	console.log("notifying user: " + getOnCallUser(schedule));
	//get user currently on call for schedule
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