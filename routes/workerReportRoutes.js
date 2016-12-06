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
      } else if (decoded['rights'] < 1 || decoded['rights'] == 4) {
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

  var entry = {'waterPurityCondition' : req.body.waterPurityCondition,
    'reporterName' : req.decoded.user.username,
    'location' : req.body.location,
    'virusPPM' : req.body.virusPPM,
    'contaminantPPM' : req.body.contaminantPPM,
    'date' : new Date(req.body.date)
  };
	var report = new WorkerReport(entry);


  WorkerReport.findOne({entry}, function(err, report) {
    if (err) throw err;
    if (report) {
      return res.json({success: false, message: 'Report already exists.'})
    } 
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
      } else if (decoded['rights'] != 2) {
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


apiRoutes.get('/view', function(req, res) {

  WorkerReport.find({}, function(err, workerReports) {
    if (err) throw err;
    res.json(workerReports);  
  }); 
});

apiRoutes.get('/view/location/:location/year/:year', function(req, res) {
  if (isNaN(req.params.year)) {
    return res.json({ 
        success: false, 
        message: 'invalid year format'
    });
  }

  var query = "1/1/" + req.params.year.toString();
  var nextQuery = "1/1/" + (parseInt(req.params.year) + 1).toString();

  WorkerReport.find({"location": req.params.location, "date" : {"$gte":new Date(query), "$lt":new Date(nextQuery)}}, function(err, workerReports) {
    if (err) throw err;
    res.json(workerReports);
  })
});

module.exports = apiRoutes;