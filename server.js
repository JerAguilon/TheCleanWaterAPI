var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var User = require('./app/models/user');
var UserReport = require('./app/models/userreport')


var port = process.env.PORT || 8080;
mongoose.connect(config.database);


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use('/css', express.static(__dirname + '/public/css'));;
app.use('/scripts', express.static(__dirname + '/public/scripts'));;
app.use('/views', express.static(__dirname + '/public/views'));;


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.listen(port);
console.log('Access link: http://localhost:' + port);

app.get('/setup',function(req, res) {
	var user = new User({
		'username' : 'user',
		'password' : 'pass',
		'responsibility' : 4,
		profile: {
			'email' : 'test@gmail.com',
			'address' : 'test',
			'title' : 'Sir'
		}
	});

	user.save(function(err) {
		if (err) throw err;
	});

	console.log('User saved successfully');

	var userreport = new UserReport({
		'waterSourceType' : 0,
		'waterSourceCondition' : 0,
		'reporterName' : 'TestReporter', 
		'location' : '1256'	
	});

	userreport.save(function(err) {
		if(err) throw err;
	});

	console.log('Report saved successfully');
	res.json({success: true});
});

var apiRoutes = require('./routes/userRoutes.js');
app.use('/api/users', apiRoutes);

var userReportRoutes = require('./routes/userReportRoutes.js');
app.use('/api/userreports', userReportRoutes);

var workerReportRoutes = require('./routes/workerReportRoutes.js');
app.use('/api/workerreports', workerReportRoutes);

// DEPRECATED ROUTE
//var historicalReportRoutes = require('./routes/historicalReportRoutes.js');
//app.use('/api/historicalreports', historicalReportRoutes);