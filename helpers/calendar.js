var moment = require('moment-timezone');
moment.tz.setDefault('America/Los_Angeles');
const Joi = require('joi');
const calendarInfo = require('../calendarInfo');
const CalendarAPI = require('node-google-calendar');
let cal = new CalendarAPI(calendarInfo);


var CalendarHelper = {


	getEventsForDate(d){
		var date = moment(d);
		start = date.startOf('day');
		end = date.clone().endOf('day');
		return cal.Events.list(
			calendarInfo.calendarId,
			{
				timeMin: start.format(),
				timeMax: end.format(),
				singleEvents: true, //No support yet for recurring events
				orderBy: 'startTime'
			} 
		);
	},

	getTomorrowsEvents(){
		return this.getEventsForDate(moment().add(1, 'day'));
	},

	getEventsForDateFormatted(date){
		return new Promise((resolve, reject) => {
			this.getEventsForDate(moment(date))
			.then(res => {
				if (res.length === 0) return resolve('No events for ' + moment(date).format('MMMM Do'));
				//var returnString = 'Events for ' + moment(date).startOf('day').format('MMMM Do') + '\n';
				var returnString = '';
				res.forEach((e, i) => {
					returnString += e.summary + ': ';
					var start = moment(e.start.dateTime);
					var end = moment(e.end.dateTime);
					returnString += start.format('h:mm A') + ' to ' + end.format('h:mm A');
					if (i !== res.length - 1) returnString += '\n'; //Add a new line if its not the last element
				});
				return resolve(returnString);
			})
			.catch(reject);
		});
	},

	getTomorrowsEventsFormatted(){
		return this.getEventsForDateFormatted(moment().add(1, 'day'));
	},

	getTodaysEventsFormatted(){
		return this.getEventsForDateFormatted(moment());
	},

	addEvent(params){		
		var result = newEventSchema.validate(params);
		if (result.error) return Promise.reject(result.error.details[0].message);
		var eventInfo = {
			start: {
				dateTime: params.start
			},
			end: {
				dateTime: params.end
			},
			summary: params.summary
		};
		return cal.Events.insert(calendarInfo.calendarId, eventInfo);
	},

}


const newEventSchema = new Joi.object().keys({
	start: Joi.date().min('now').required(),
	end: Joi.date().min(Joi.ref('start')).required(),
	summary: Joi.string().required()
});


module.exports = CalendarHelper;