// API ROUTES -------------------
var express = require('express');
// get an instance of the router for api routes
var apiRoutes = express.Router(); 
var WorkerReport = require('../app/models/workerreport');
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
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {     
    str = JSON.stringify(decoded);
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else if (decoded['rights'] < 0) {
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

	var report = new WorkerReport({
		'waterPurityCondition' : req.body.waterPurityCondition,
		'reporterName' : req.decoded.user.username,
		'location' : req.body.location,
    'virusPPM' : req.body.virusPPM,
    'contaminantPPM' : req.body.contaminantPPM,
    'date' : new Date(req.body.date)
	});

  report.save(function(err) {
    if (err) {
      res.json({
        'success' : false,
        'message' : 'failed to save report'
      })
    }
  }); 

  res.json({
    'success' : true,
    'message' : 'Worker report added'   
  });
});

apiRoutes.get('/view', function(req, res) {

  WorkerReport.find({}, function(err, userReports) {
    if (err) throw err;
    res.json(userReports);  
  }); 
});

module.exports = apiRoutes;