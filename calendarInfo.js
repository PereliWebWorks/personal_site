require('dotenv').config();
const key = require('./' + process.env.KEY_FILE).private_key;

module.exports = {
	calendarUrl: process.env.CALENDAR_URL,
	serviceAcctId: process.env.SERVICE_ACCT_ID,
	calendarId: process.env.CALENDAR_ID,
	key: key,
	timezone: 'America/Los_Angeles'
};