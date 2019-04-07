require('dotenv').config();
var CronJob = require('cron').CronJob;
var textController = require('./controllers/text');
var calendar = require('./helpers/calendar');

function sendMorningMessage(){
	var message = {
		to: process.env.MY_PHONE_NUMBER,
		from: process.env.TWILIO_PHONE_NUMBER_CALENDAR
	};

	Promise.all([calendar.getTodaysEventsFormatted(), calendar.getTomorrowsEventsFormatted()])
	.then(res => {
		var todaysEvents = res[0];
		var tomorrowsEvents = res[1];
		var body = '';
		body += "Pretend the fear isn't there\n\n";
		body += "Today's events\n";
		body += todaysEvents;
		body += "\n\nTomorrow's events\n";
		body += tomorrowsEvents;
		message.body = body;
		return textController.send(message);
	})
	.catch(console.log);
}

module.exports = {
	start(){
		new CronJob(
			'0 4 * * *', 
			sendMorningMessage,
			null,
			true,
			'America/Los_Angeles'
		);
		console.log('Cron jobs started');
	}
}