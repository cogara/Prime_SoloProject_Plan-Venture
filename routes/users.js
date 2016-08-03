var router = require('express').Router();
var path = require('path');
var User = require('../models/user.js');

router.get('/defaultEquip', function(request, response) {
  User.getDefaultEquipment(request.user.id, function(err, equipment) {
    if(err){
      console.log(err);
      response.sendStatus(500);
    } else {
      response.send(equipment);
    }
  });
});

module.exports = router;
