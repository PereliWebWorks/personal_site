
var moment = require('../helpers/moment');
var calendar = require('../helpers/calendar');

module.exports = {
	index(req, res){},

	create(event){
		return calendar.addEvent(event);
	},

	find(req,res){}
}