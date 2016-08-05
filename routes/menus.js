var router = require('express').Router();
var Menu = require('../models/menu.js');

router.get('/', function(request, response) {
  console.log('In Menu Router');
  response.sendStatus(200);
})

router.post('/create', function(request, response){
  console.log(request.body);
})


module.exports = router;
