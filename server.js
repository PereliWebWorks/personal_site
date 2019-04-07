require('dotenv').config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const cronJobs = require('./cronJobs');


const textController = require('./controllers/text');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
	res.send('it works');
});


app.post('/api/text/calendar/new_event', (req, res) => {
	textController.calendar.receive(req)
	.then(resultString => {
		const twiml = new MessagingResponse();
		twiml.message(resultString);
		res.writeHead(200, { 'Content-Type': 'text/xml' });
		res.end(twiml.toString());
	})
	.catch(console.log);
});

http.createServer(app).listen(process.env.SERVER_PORT, () => {
  console.log('Express server listening on port ' + process.env.SERVER_PORT);
});


//Start cron jobs
cronJobs.start();