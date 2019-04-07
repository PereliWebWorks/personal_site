var moment = require('./moment.js');
var chrono = require('chrono-node');

//Takes the 'start' or the 'end' from the results of 'chrono.parse'
function parsedDateObjectToString(parsed){
	var fields = ['year', 'month', 'day', 'hour', 'minute'];
	var obj = {};
	fields.forEach(f => {
		obj[f] = parsed.knownValues[f] || parsed.impliedValues[f];
		if (f === 'month') obj[f]--;
	});
	return moment(obj).format();
}


module.exports = {
	textToEvent(textBody) {
		//Timezone stuff gets weird, so switch 'tomorrow' with explicit date using moment
		textBody = textBody.replace(/tomorrow/gi, moment().add(1, 'day').format('M/D/YYYY'));
		var parsed = chrono.parse(textBody, new Date(moment().format()))[0];
		if (!parsed) return false;
		var startString = parsedDateObjectToString(parsed.start);
		var endString = parsed.end ? parsedDateObjectToString(parsed.end) : moment(startString).add(1, 'hour').format(); //Default event length is one hour
		//Now to get the event name out of it
		var eventName = textBody.substr(0, parsed.index).trim();
		return {
			start: startString,
			end: endString,
			summary: eventName
		}
	}
}