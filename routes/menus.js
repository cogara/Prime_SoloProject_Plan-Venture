var router = require('express').Router();
var Menu = require('../models/menu.js');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

router.get('/', function(request, response) {
  console.log('In Menu Router');
  response.sendStatus(200);
})

router.post('/create', function(request, response){
  console.log('is it this?', request.body);
  response.send('sent menu')
})

router.get('/id/:id', function(request, response){
  console.log('finding menu, trip id:', request.params);
  Menu.find({'tripId': request.params.id}, function(err, trip){
    if(err){
      console.log('error getting menu');
      response.sendStatus(500);
    } else {
      console.log('found trip:', trip[0]);
      response.send(trip[0]);
    }
  })
})

router.put('/addItem/:id', function(request, response){
  console.log(request.params);
  console.log(request.body);
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
            console.log(menu);
            response.sendStatus(200);
          }
        });
      console.log('Updated Dinner');
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
            console.log(menu);
            response.sendStatus(200);
          }
        });
      console.log('Updated Lunch');
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
            console.log(menu);
            response.sendStatus(200);
          }
        });
      console.log('Updated Breakfast');
      return;
    }
});

module.exports = router;
