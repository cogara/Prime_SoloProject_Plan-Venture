var router = require('express').Router();
var User = require('../models/user.js');
var Trip = require('../models/trip.js');

router.get('/', function(request, response) {
  User.getTrips(request.user.id, function(err, trips){
    if(err){
      console.log(err);
      response.sendStatus(500);
    } else {
      // console.log('Trips:', trips);
      response.send(trips);
    }
  })
})

router.get('/users/:tripid', function(request, response) {
  console.log('getting id');
  console.log(request.params.tripid);
  Trip.getUsers(request.params.tripid, function(err, users){
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      console.log(users);
      response.send(users);
    }
  })
})

router.get('/pe/:tripid', function(request, response) {
  console.log('getting equipment');
  console.log(request.params);
  console.log(request.user);
  User.getPersonalEquipment(request.user.id, request.params.tripid, function(err, equipment){
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.send(equipment);
    }
  })
})

router.get('/ge/:tripid', function(request, response) {
  Trip.getGroupEquipment(request.params.tripid, function(err, equipment){
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      console.log('Group equip', equipment);
      response.send(equipment);
    }
  })
})

router.post('/create', function(request, response) {
  Trip.newTrip(request, function(err, trips){
    if(err) {
      console.log(err);
      response.sendStatus(500)
    } else {
      response.sendStatus(200);
    }
  });
});

module.exports = router;
