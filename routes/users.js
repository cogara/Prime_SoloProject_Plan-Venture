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

// router.get('/profile/:id', function(request, response){
//
//
//   User.findById(request.params.id, function(err, user){
//     if(err){
//       console.log(err);
//       response.sendStatus(500);
//     } else {
//       var sendUser = {};
//       sendUser.id = user.id;
//       sendUser.username = user.id;
//       sendUser.email = user.id;
//       sendUser.phone = user.id;
//       console.log(user);
//       response.sendStatus(200);
//     }
//   })
//
// })

router.post('/addEquip', function(request, response) {
  User.addDefaultEquipment(request.user.id, request.body, function(err) {
    if(err){
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  });
});

router.delete('/remEquip/:id', function(request, response) {
  if(!request.user) {
    response.sendStatus(500);
  } else {
    User.removeDefaultEquipment(request.params.id, function(err) {
      if(err){
        console.log(err);
        response.sendStatus(500);
      } else {
        response.sendStatus(200);
      }
    });
  }
});

module.exports = router;
