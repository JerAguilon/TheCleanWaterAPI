// API ROUTES -------------------
var express = require('express');
// get an instance of the router for api routes
var apiRoutes = express.Router(); 
var UserReport = require('../app/models/userreport');
var jwt = require('jsonwebtoken');
var app = express();
var bodyParser = require('body-parser');

var config = require('../config');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.set('superSecret', config.secret);


apiRoutes.get("/", function(req, res) {
	res.json({'success' : true});
});

// route middleware to verify a token, rights must be >= 0
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log(req.body);
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {     
    str = JSON.stringify(decoded);
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else if (decoded['rights'] < 0 || decoded['rights'] == 3) {
        return res.json({ success: false, message: 'Insuficcient rights to view this data.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded; 
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

apiRoutes.post('/submit', function(req, res) {
	if (!req.body.reporterName) {
		req.body.reporterName = req.decoded.username;
	}

	if (req.decoded.user.isBanned == true) {
      return res.json({ success: false, message: 'User is banned.' });    
	}

	var report = new UserReport({
		'waterSourceType' : req.body.waterSourceType,
		'waterSourceCondition' : req.body.waterSourceCondition,
		'reporterName' : req.decoded.user.username,
		'location' : req.body.location,
		'date' : new Date(req.body.date)
	});

	UserReport.findOne({'location' : req.body.location},
		function(err, foundUserReport) {
			if (!foundUserReport) {
				report.save(function(err) {
					if (err) throw err;
				});	

				res.json({
					'success' : true,
					'message' : 'User report added'		
				});
			} else {
				res.json({
					'success' : false,
					'message' : 'User report already exists'
				});
			}
		});	
});

apiRoutes.get('/view', function(req, res) {

	UserReport.find({}, function(err, userReports) {
		if (err) throw err;
		res.json(userReports);	
	});	
});

module.exports = apiRoutes;