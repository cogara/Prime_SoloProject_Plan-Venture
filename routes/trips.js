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

router.get('/info/:tripid', function(request, response) {
  Trip.getOverview(request.params.tripid, function(err, overview){
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.send(overview);
    }
  })
})

router.get('/pe/:tripid', function(request, response) {
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

router.post('/join', function(request, response) {
  Trip.joinTrip(request, function(err, message){
    if(err) {
      console.log(err);
      response.sendStatus(500)
    } else {
      response.send(message);
    }
  });
});

router.post('/add/pe/:id', function(request, response) {
  Trip.addPersonalEquipment(request, function(err, message){
    if(err) {
      console.log(err);
      response.sendStatus(500)
    } else {
      response.send(message);
    }
  });
});

router.post('/add/ge/:id', function(request, response) {
  Trip.addGroupEquipment(request, function(err, message){
    if(err) {
      console.log(err);
      response.sendStatus(500)
    } else {
      response.send(message);
    }
  });
});

module.exports = router;
