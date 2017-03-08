var https = require('https');

// First parameter is the end of the webhook url for the integration you want to message, for example:
// webhook url: https://hooks.slack.com/services/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
// webhook_path: /services/T25EFUYP7/B3X4YAHUL/JLLTip8VjuNdkauvMRkMim9a

// Second parameter is the message
var postMessage = function(webhook_path, message) {
	var postData = JSON.stringify({
	  'text' : message
	});

	var options = {
	  hostname: 'hooks.slack.com',
	  port: 443,
	  path: webhook_path,
	  method: 'POST'
	};

	var req = https.request(options, (res) => {
	  res.setEncoding('utf8');
	});

	req.on('error', (e) => {
	  console.log('problem with request: ${e.message}');
	});

	// write data to request body
	req.write(postData);
	req.end();
}

module.exports = {
	postMessage : postMessage
}