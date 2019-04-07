require('dotenv').config();
const moment = require('../helpers/moment');
const calendar = require('../helpers/calendar');
const textParser = require('../helpers/textParser');
var twilio = require('twilio');
var client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const MessagingResponse = twilio.twiml.MessagingResponse;

// function string{
// 	//Require string and res
// 	if (!string) throw new Error('Need string');
// 	if (!res) throw new Error('Need res');
// 	const twiml = new MessagingResponse();
// 	twiml.message(string);
// 	res.writeHead(200, { 'Content-Type': 'text/xml' });
// 	res.end(twiml.toString());
// }

module.exports = {
	receive(req, res){

	},

	send(message){
		return client.messages.create(message);
	},

	calendar: {
		receive(req){
			var body = req.body && req.body.Body ? req.body.Body : false;
			if (!body) return Promise.resolve("Somehow you sent a text without a body? The fuck are you doing?");
			return new Promise((resolve, reject) => {
				//Lets see what kind of text it is
				//Parse the body
				var eventObject = textParser.textToEvent(body);
				if (!eventObject) return resolve("Yeah, I can't parse what you sent me into an event. Try again.");
				calendar.addEvent(eventObject)
				.then(() => {
					return resolve('Added ' + eventObject.summary + ' for ' + moment(eventObject.start).format('dddd, MMMM Do [at] h:mmA'));
				})
				.catch(err => {
					console.log(err);
					return resolve('Something went wrong. Check the console I guess.');
				})
			});
		}
	},
}