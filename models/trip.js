var pg = require('pg');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var config = {
  database: 'planventure',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

function getUsers(tripId, callback) {
  // console.log('Getting Trips');
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('SELECT trip_id, user_id, username FROM trip_assignments JOIN users ON trip_assignments.user_id = users.id WHERE trip_id=$1', [tripId], function(err, users){
      if(err){
        done(err);
        return callback(err)
      }
      done();
      callback(null, users.rows);
    });
  });
}

function getGroupEquipment(tripId, callback) {
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('SELECT trip_id, equipment, username, users.id as user_id FROM trip_equipment LEFT OUTER JOIN users ON trip_equipment.responsible = users.id WHERE trip_id=$1 AND is_group=TRUE', [tripId], function(err, equipment){
      if(err){
        done(err);
        return callback(err)
      }
      done();
      callback(null, equipment.rows);
    });
  });
}

function newTrip(request, callback) {
  console.log(request.body);
  console.log(request.user);
  var tripName = request.body.tripName;
  var organizerId = request.user.id;
  var tripDate = new Date();
  var tripDuration = request.body.tripDuration;
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('INSERT INTO trips (trip_name, organizer_id, date, duration) VALUES ($1, $2, $3, $4) RETURNING id, trip_name', [tripName, organizerId, tripDate, tripDuration], function(err, trip){
      if(err){
        done(err);
        return callback(err)
      }
      client.query('INSERT INTO trip_assignments (trip_id, user_id) VALUES ($1, $2)',[trip.rows[0].id, organizerId], function(err, result){
        if(err){
          done(err);
          return callback(err)
        }
        done();
        console.log(trip.rows);
        callback(null, trip.rows);
      });
    });
  });
}

module.exports = {
  getUsers: getUsers,
  getGroupEquipment: getGroupEquipment,
  newTrip: newTrip
};
