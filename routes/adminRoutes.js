// API ROUTES -------------------
var express = require('express');
// get an instance of the router for api routes
var apiRoutes = express.Router(); 
var User = require('../app/models/user');
var WorkerReport = require('../app/models/workerreport');
var UserReport = require('../app/models/userreport');
var jwt = require('jsonwebtoken');
var app = express();
var bodyParser = require('body-parser');

var config = require('../config');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.set('superSecret', config.secret);


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
      } else if (decoded['rights'] != 3) {
        console.log("foo");
        return res.json({ success: false, message: 'Insuficcient rights to view this data.'});    
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


apiRoutes.post('/workerReports/deleteReports', function(req, res) {
  if (!req.body.ids) {
      return res.json({ success: false, message: 'Invalid input type' });
  }  

  idList = req.body.ids.split(',');

  if (!(idList.prop && idList.prop.constructor === Array)) {
      return res.json({ success: false, message: 'Invalid input type' });
  }
  idList = idList.map(function(id) { return ObjectId(id); });

  WorkerReport.remove({'_id': {$in : idList}}, function(err) {
    if (err) throw err;

    return res.json({success: true, message: 'Documents deleted successfully'});
  });

});

apiRoutes.get('/users/view', function(req, res) {
    User.find({}, function(err, users) {
      if (err) throw err;
      res.json(users);  
    }); 
});


apiRoutes.post('/users/deleteUser/:id', function(req, res) {
    User.remove({'_id':req.params.id}, function(err) {
      if (err) throw err;
      console.log("FOO")

      return res.json({success: true, message: 'User deleted successfully'})
    });
});


apiRoutes.post('/users/toggleBan/:id', function(req, res) {
  User.findOne({'_id' : req.params.id}, function (err, user) {
    if (user.banned) {
      user.banned = false;
    } else {
      user.banned = true;
    }

    user.save(function(err) { if (err) throw err;});

    return res.json({success: true, message: 'User updated'});
  });
});

apiRoutes.post('/users/toggleBlock/:id', function(req, res) {
  User.findOne({'_id' : req.params.id}, function (err, user) {
    if (user.attempts == 3) {
      user.attempts = 0;
    } else {
      user.attempts = 3;
    }

    user.save(function(err) { if (err) throw err;});

    return res.json({success: true, message: 'User updated'});
  });
});

module.exports = apiRoutes;