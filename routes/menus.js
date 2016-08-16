var router = require('express').Router();
var Menu = require('../models/menu.js');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

router.get('/', function(request, response) {
  response.sendStatus(200);
})

router.post('/create', function(request, response){
  response.send('sent menu')
})

router.get('/id/:id', function(request, response){
  Menu.find({'tripId': request.params.id}, function(err, trip){
    if(err){
      console.log('error getting menu');
      response.sendStatus(500);
    } else {
      response.send(trip[0]);
    }
  })
})

router.put('/addItem/:id', function(request, response){
  var meal = request.body.meal;
  var mealId = new ObjectId().toString();
  switch(meal) {
    case 'dinner':
      Menu.update(
        {'tripId': request.params.id, "menu.day": request.body.day},
        {'$push':
            {
                'menu.$.dinner':
                    {
                        'itemId': mealId,
                        'name': request.body.item.name,
                        'qty': request.body.item.qty
                    }
            }
        }, function(err, menu){
          if(err){
            console.log(err);
            response.sendStatus(500)
          } else {
            response.sendStatus(200);
          }
        });
      return;
    case 'lunch':
      Menu.update(
        {'tripId': request.params.id, "menu.day": request.body.day},
        {'$push':
            {
                'menu.$.lunch':
                    {
                        'itemId': mealId,
                        'name': request.body.item.name,
                        'qty': request.body.item.qty
                    }
            }
        }, function(err, menu){
          if(err){
            console.log(err);
            response.sendStatus(500)
          } else {
            response.sendStatus(200);
          }
        });
      return;
    case 'breakfast':
      Menu.update(
        {'tripId': request.params.id, "menu.day": request.body.day},
        {'$push':
            {
                'menu.$.breakfast':
                    {
                        'itemId': mealId,
                        'name': request.body.item.name,
                        'qty': request.body.item.qty
                    }
            }
        }, function(err, menu){
          if(err){
            console.log(err);
            response.sendStatus(500);
          } else {
            response.sendStatus(200);
          }
        });
      return;
    }
});

router.put('/removeItem/:id', function(request, response){
  var tripId = request.params.id;
  var day = request.body.day;
  var meal = request.body.meal;
  var itemId = request.body.item;
  switch(meal) {
    case 'dinner':
      Menu.update(
        {'tripId': tripId, "menu.day": day},
        {'$pull':
            {
                'menu.$.dinner':
                    {
                        'itemId': itemId
                    }
            }
        }, function(err, menu){
          if(err){
            console.log(err);
            response.sendStatus(500)
          } else {
            response.sendStatus(200);
          }
        });
      return;
    case 'lunch':
      Menu.update(
        {'tripId': tripId, "menu.day": day},
        {'$pull':
            {
                'menu.$.lunch':
                    {
                        'itemId': itemId
                    }
            }
        }, function(err, menu){
          if(err){
            console.log(err);
            response.sendStatus(500)
          } else {
            response.sendStatus(200);
          }
        });
      return;
    case 'breakfast':
      Menu.update(
        {'tripId': tripId, "menu.day": day},
        {'$pull':
            {
                'menu.$.breakfast':
                    {
                        'itemId': itemId
                    }
            }
        }, function(err, menu){
          if(err){
            console.log(err);
            response.sendStatus(500);
          } else {
            response.sendStatus(200);
          }
        });
      return;
    }
});

router.delete('/:id', function(request, response) {
  console.log('Menus Router', request.params);
  var tripId = parseInt(request.params.id);
  console.log(typeof tripId);
  Menu.remove({'tripId': tripId}, function(err) {
    if(err) {
      response.sendStatus(500);
    }
    response.sendStatus(200);
  });
})

module.exports = router;
