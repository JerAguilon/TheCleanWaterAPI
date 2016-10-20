// API ROUTES -------------------
var express = require('express');
// get an instance of the router for api routes
var apiRoutes = express.Router(); 
var User = require('../app/models/user');
var jwt = require('jsonwebtoken');
var app = express();

var config = require('../config');
app.set('superSecret', config.secret);


apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign({'user' : user, 'rights':user.responsibility}, app.get('superSecret'), {
          expiresIn: 1440, // expires in 24 hours,
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {     
    str = JSON.stringify(decoded);
    console.log("test:" + decoded['rights']);
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else if (decoded['rights'] < 4) {
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



// route to show a random message (GET http://localhost:8080/api/)
/*apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});
*/
// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/userlist', function(req, res){ 
  User.find({}, function(err, users) {
    res.json(users);
  });
});   


module.exports = apiRoutes;