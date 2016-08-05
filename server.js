//modules
var express = require('express');
var bodyParser = require('body-parser');

var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var env = require('dotenv').config();

//routers and models
var User = require('./models/user.js');
var register = require('./routes/register.js');
var login = require('./routes/login.js');
var trips = require('./routes/trips.js');
var users = require('./routes/users.js');
var index = require('./routes/index');

var app = express();

//Static and config files
app.use(session({
  secret: process.env.SECRET,
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 30 * 60 * 1000, secure: false}
}));

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
  }, function(username, password, done) {
  User.findByUsername(username, function(err, user) {
    if(err) {
      return done(err);
    }
    if(!user) {
      return done(null, false, {message: 'Incorrect username and password'})
    }
    User.passwordCheck(user.username, password, function(err, isMatch) {
      if(err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {message: 'incorrect username and password'});
      }
    });
  });
}));

// converts user to user id
passport.serializeUser(function(user, done){
  done(null, user.id);
});

// converts user id to user
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//routes
app.use('/', index);
app.use('/register', register);
app.use('/login', login);
app.use('/trips', trips);
app.use('/users', users);
app.get('/logout', function(request, response){
  request.logout();
  response.sendStatus(200);
});
app.get('/currentuser', function(request, response){
  response.send(request.user);
});

//server start
var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Listening on port', port);
})
