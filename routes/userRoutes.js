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
        var token = jwt.sign({'user' : { '_id' : user._id,  'username' : user.username, 'responsibility' : user.responsibility}, 'rights':user.responsibility}, app.get('superSecret'), {
          //expiresIn: 1440, // expires in 24 hours,
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

//route to add a user   
apiRoutes.post('/adduser', function (req, res) {
  var user = new User({
    'username' : req.body.username,
    'password' : req.body.password,
    'responsibility' : req.body.responsibility,
    //_id stores the id
    'profile' : {
      'email' : req.body.email,
      'address' : req.body.address,
      'title' : req.body.title
    }
  });

  User.findOne({
    'username' : req.body.username
  }, function(err, foundUser) {

    if (err) throw err;

    if (!foundUser) {
      user.save(function(err) {
        if (err) throw err;
      });
      res.json({
        success: true,
        message: 'User saved successfully',
      });
    } else {
      res.json({
        success: false,
        message: 'User already exists'
      });
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
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
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
apiRoutes.get('/me', function(req, res){ 
  User.findOne(req.decoded['username'], function(err, user) {
    if (!user) {
      return res.json({success: false, message : 'Failed to get your user data'});
    } else {
      return res.json({success: true, message : 'User found', userData : user})
    }
  });
});

apiRoutes.post('/me/update', function(req, res) {
  var userID = req.decoded.user['_id'];

  console.log(userID);

  User.findById(userID, function(err, user) {
    if (err) throw err;

    console.log(user);
    if (req.body.email) {
      user.profile.email = req.body.email;
    }

    if (req.body.address) {
      user.profile.address = req.body.address;
    }

    if (req.body.title) {
      user.profile.title = req.body.title;
    }

    user.save(function(err) {
      if (err) throw err;
      console.log('Saved user');
      return res.json({success: true, message: 'User saved'})
    })

  })
     


});



module.exports = apiRoutes;