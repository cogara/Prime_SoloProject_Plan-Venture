var router = require('express').Router();
// var User = require('../models/user.js');
var passport = require('passport');
var path = require('path');

router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname,'..','public','views','login.html'));
})

router.get('/success', function(request, response) {
  console.log('User logged in:',request.user.username, 'at', new Date());
  var user = {};
  user.id = request.user.id;
  user.username = request.user.username;
  user.email = request.user.email;
  user.phone = request.user.phone;
  response.send(user);
})
router.get('/failure', function(request, response) {
  console.log('Login Failure', new Date());
  response.sendStatus(500);
})

router.post('/', passport.authenticate('local', {
  successRedirect: '/login/success',
  failureRedirect: '/login/failure'
}));

module.exports = router;
