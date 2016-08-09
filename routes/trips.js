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

router.delete('/leave/:id', function(request, response) {
  console.log(request.user);
  console.log(request.params);
  Trip.leaveTrip(request, function(err, message){
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
      response.sendStatus(500);
    } else {
      response.send(message);
    }
  });
});

router.delete('/remEquip/:id', function(request, response){
  Trip.removeEquipment(request.params.id, function(err, message){
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  })
})

router.put('/claimEquip/:id', function(request, response) {
  Trip.claimEquipment(request.params.id, request.user.id, function(err, message){
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  })
})

router.put('/unclaimEquip/:id', function(request, response) {
  Trip.unclaimEquipment(request.params.id, function(err, message){
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  })
});

router.post('/messages/add/:id', function(request, response) {
  var data = {};
  console.log(request.body);
  data.tripId = request.params.id;
  data.message = request.body.message;
  data.userId = request.user.id;
  Trip.sendMessage(data, function(err, message) {
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  })
})

router.get('/messages/:id', function(request, response) {
  Trip.getMessages(request.params.id, function(err, messages) {
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.send(messages);
    }
  })
})

router.delete('/messages/delete/:id', function(request, response) {
  Trip.deleteMessage(request.params.id, function(err) {
    if(err) {
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  })
})

module.exports = router;
