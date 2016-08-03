var router = require('express').Router();
// var User = require('../models/user.js');
var passport = require('passport');
var path = require('path');

router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname,'..','public','views','login.html'));
})

router.get('/success', function(request, response) {
  var user = {};
  user.username = request.user.username;
  user.email = request.user.email;
  response.send(user);
})
router.get('/failure', function(request, response) {
  console.log('Failure');
  response.sendStatus(500);
})

router.post('/', passport.authenticate('local', {
  successRedirect: '/login/success',
  failureRedirect: '/login/failure'
}));

module.exports = router;
