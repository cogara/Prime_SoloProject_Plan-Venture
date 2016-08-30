var router = require('express').Router();
var User = require('../models/user.js');

router.post('/', function(request, response) {
  User.create(request.body.username, request.body.password, function(err) {
    if(err){
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  });
});

module.exports = router;
