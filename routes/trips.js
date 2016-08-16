var router = require('express').Router();
var User = require('../models/user.js');
var Trip = require('../models/trip.js');
var Menu = require('../models/menu.js');

router.get('/', function(request, response) {
  User.getTrips(request.user.id, function(err, trips){
    if(err){
      console.log(err);
      response.sendStatus(500);
    } else {
      response.send(trips);
    }
  })
})

router.get('/info/:tripId', function(request, response) {
  var data = {};
  data.tripId = request.params.tripId;
  data.userId = request.user.id;
  Trip.getOverview(data, function(err, overview){
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.send(overview);
    }
  })
})

router.post('/equipment/:tripid', function(request, response) {
  if (request.query.personal) {
    Trip.addPersonalEquipment(request, function(err, message){
      if(err) {
        console.log(err);
        response.sendStatus(500)
      } else {
        response.send(message);
      }
    });
  } else if (request.query.group) {
    Trip.addGroupEquipment(request, function(err, message){
      if(err) {
        console.log(err);
        response.sendStatus(500)
      } else {
        response.send(message);
      }
    });
  } else {
    console.log('missing queries on call');
  }
});

router.get('/equipment/:tripid', function(request, response) {
  var tripEquipment = {};
  if(request.query.group && request.query.personal) {
    Trip.getGroupEquipment(request.params.tripid, function(err, group){
      if(err) {
        console.log(err);
        response.sendStatus(500);
      } else {
        tripEquipment.group = group;
        User.getPersonalEquipment(request.user.id, request.params.tripid, function(err, personal){
          if(err) {
            console.log(err);
            response.sendStatus(500);
          } else {
            tripEquipment.personal = personal;
            response.send(tripEquipment);
          }
        })
      }
    })
  } else if (request.query.group) {
    Trip.getGroupEquipment(request.params.tripid, function(err, group){
      if(err) {
        console.log(err);
        response.sendStatus(500);
      } else {
        tripEquipment.group = group;
        response.send(tripEquipment)
      }
    });
  } else if (request.query.personal) {
    User.getPersonalEquipment(request.user.id, request.params.tripid, function(err, personal){
      if(err) {
        console.log(err);
        response.sendStatus(500);
      } else {
        tripEquipment.personal = personal;
        response.send(tripEquipment);
      }
    });
  } else {
    console.log('Incorrect Query Requested');
  }
})

router.post('/create', function(request, response) {
  console.log(request.query);
  if(request.query.copy) {
    Trip.copyTrip(request, request.query.id, function(err) {
      if(err) {
        console.log(err);
        response.sendStatus(500);
      } else {
        response.sendStatus(200);
      }
    })
  } else {
    Trip.newTrip(request, function(err, trips){
      if(err) {
        console.log(err);
        response.sendStatus(500)
      } else {
        response.sendStatus(200);
      }
    })
  }
});

router.post('/join/', function(request, response) {
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
  var isOrg = request.query.organizer;
  Trip.leaveTrip(request, isOrg, function(err, message){
    if(err) {
      console.log(err);
      response.sendStatus(500)
    } else {
      response.send(message);
    }
  });
});

router.delete('/removeEquipment/:id', function(request, response){
  Trip.removeEquipment(request.params.id, function(err, message){
    if(err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  })
})

router.put('/equipment/:id', function(request, response) {
  if (request.query.action === 'claim') {
    Trip.claimEquipment(request.params.id, request.user.id, function(err, message){
      if(err) {
        console.log(err);
        response.sendStatus(500);
      } else {
        response.sendStatus(200);
      }
    })
  } else if (request.query.action === 'unclaim') {
    Trip.unclaimEquipment(request.params.id, function(err, message){
      if(err) {
        console.log(err);
        response.sendStatus(500);
      } else {
        response.sendStatus(200);
      }
    })
  }
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
  data.tripId = request.params.id;
  data.message = request.body.message;
  data.timeStamp = request.body.timeStamp;
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
      console.log('Messages timestamp?');
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

router.put('/edit/:id', function(request, response) {
  if(request.query.location) {
    Trip.editLocation(request.params.id, request.body.location, function(err){
      if(err) {
        response.sendStatus(500);
      } else {
      response.sendStatus(200);
      console.log('trip edited');
      }
    });
  }

  if(request.query.date) {
    Trip.editDate(request.params.id, request.body.date, function(err){
      if(err) {
        response.sendStatus(500);
      } else {
      response.sendStatus(200);
      console.log('trip edited');
      }
    });
  }

  if(request.query.notes) {
    Trip.editNotes(request.params.id, request.body.notes, function(err){
      if(err) {
        response.sendStatus(500);
      } else {
      response.sendStatus(200);
      console.log('trip edited');
      }
    });
  }

  if(request.query.duration) {
    Trip.editDuration(request.params.id, request.body.duration, function(err){
      if(err) {
        console.log(err);
        response.sendStatus(500);
      } else {
        Menu.update(
          {'tripId': request.params.id},
          {'$set':
              {
                  'menu': request.body.menu
              }
          }, function(err, menu) {
          if(err) {
            console.log(err);
            response.sendStatus(500);
          }
          response.sendStatus(200);
          console.log('trip edited');
        });
      }
    });
  }

})

module.exports = router;
