// API ROUTES -------------------
var express = require('express');
// get an instance of the router for api routes
var apiRoutes = express.Router(); 
var User = require('../app/models/user');
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

module.exports = apiRoutes;