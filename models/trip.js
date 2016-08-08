var pg = require('pg');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Menu = require('./menu.js');
var SALT_WORK_FACTOR = 10;

var config = {
  database: 'planventure',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

function getOverview(tripId, callback) {
  var data = {};
  // console.log('Getting Trips');
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('SELECT trip_assignments.id, trip_id, user_id, username, email, phone FROM trip_assignments JOIN users ON trip_assignments.user_id = users.id WHERE trip_id=$1', [tripId], function(err, users){
      if(err){
        done(err);
        return callback(err)
      }
      client.query('SELECT id, trip_name, organizer_id, date, location, duration FROM trips WHERE id=$1', [tripId], function(err, info) {
        if(err){
          done(err);
          return callback(err);
        }
        done();
        data.users = users.rows;
        data.info = info.rows;
        callback(null, data);
      });
    });
  });
}

function getGroupEquipment(tripId, callback) {
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('SELECT trip_equipment.id, trip_id, equipment, username, users.id as user_id FROM trip_equipment LEFT OUTER JOIN users ON trip_equipment.responsible = users.id WHERE trip_id=$1 AND is_group=TRUE', [tripId], function(err, equipment){
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
  var tripName = request.body.tripName;
  var organizerId = request.user.id;
  var tripDate = request.body.tripDate
  var tripDuration = request.body.tripDuration;
  var tripLocation = request.body.tripLocation;
  var accessCode = request.body.accessCode;
  bcrypt.hash(accessCode, SALT_WORK_FACTOR, function(err, hash) {
    if(err) {
      console.log(err);
      return callback(err);
    }
    pool.connect(function(err, client, done){
      if(err){
        done();
        return callback(err);
      }
      client.query('INSERT INTO trips (trip_name, organizer_id, date, location, duration, access_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, trip_name', [tripName, organizerId, tripDate, tripLocation, tripDuration, hash], function(err, trip){
        if(err){
          done(err);
          return callback(err)
        }
        client.query('INSERT INTO trip_assignments (trip_id, user_id) VALUES ($1, $2)',[trip.rows[0].id, organizerId], function(err, result){
          if(err){
            done(err);
            return callback(err)
          }
          client.query('SELECT * FROM default_equipment WHERE user_id=$1', [request.user.id], function(err, equipment){
            if(err){
              console.log(err);
              done();
              return callback(err);
            }
            for (var i = 0; i < equipment.rows.length; i++) {
              client.query('INSERT INTO trip_equipment (trip_id, equipment, responsible) VALUES ($1, $2, $3)', [trip.rows[0].id, equipment.rows[i].equipment, request.user.id], function(err) {
                if(err) {
                  console.log('error in loop', err);
                  done();
                  return callback(err);
                }
              });
            }
            createMenu(tripDuration, trip.rows[0].id);
            done();
            return callback(null, trip.rows);
          })
        });
      });
    });
  });
}



function joinTrip(request, callback) {
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('SELECT id, access_code FROM trips WHERE trip_name=$1',[request.body.tripName], function(err, trip){
      if(err){
        console.log(err);
        done();
        return callback(err);
      }
      if(!trip.rows[0]){
        done();
        return callback(null, {message: 'no trip found'});
      }
      client.query('SELECT * FROM trip_assignments WHERE trip_id=$1 AND user_id=$2', [trip.rows[0].id, request.user.id], function(err, users){
        if(err) {
          console.log(err);
          done();
          return callback(err);
        }
        if(users.rows[0]) {
          done();
          return callback(null, {message: 'Already Added'});
        }
        if(!users.rows[0]) {
          bcrypt.compare(request.body.accessCode, trip.rows[0].access_code, function(err, isMatch){
            if(err){
              console.log(err);
              done();
              return callback(err);
            }
            if(!isMatch) {
              done();
              return callback(null, {message: 'Invalid Access Code'})
            }
            if (isMatch) {
              client.query('INSERT INTO trip_assignments (trip_id, user_id) VALUES ($1, $2) RETURNING trip_id, user_id', [trip.rows[0].id, request.user.id], function(err, result){
                if(err) {
                  console.log(err);
                  done();
                  return callback(err);
                }
                client.query('SELECT * FROM default_equipment WHERE user_id=$1', [request.user.id], function(err, equipment){
                  if(err){
                    console.log(err);
                    done();
                    return callback(err);
                  }
                  if(equipment.rows[0]) {
                    for (var i = 0; i < equipment.rows.length; i++) {
                      client.query('INSERT INTO trip_equipment (trip_id, equipment, responsible) VALUES ($1, $2, $3)', [trip.rows[0].id, equipment.rows[i].equipment, request.user.id], function(err){
                        if(err){
                          console.log('loop error', err);
                          done();
                          return callback(err);
                        }
                      });
                    }
                  }
                  done();
                  callback(null, {message: 'User Added'});
                });
              });
            }
          });
        }
      });
    });
  });
}

function addPersonalEquipment(request, callback) {
  var tripId = request.params.id;
  var userId = request.user.id;
  var equipmentName = request.body.equipmentName;
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('INSERT INTO trip_equipment (trip_id, equipment, responsible) VALUES ($1, $2, $3)', [tripId, equipmentName, userId], function(err){
      if(err){
        done(err);
        return callback(err)
      }
      done();
      return callback(null, {message: 'equipment added'});
    });
  });
}

function removeEquipment(id, callback) {
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('DELETE FROM trip_equipment WHERE id=$1', [id], function(err){
      if(err){
        done(err);
        return callback(err)
      }
      done();
      return callback(null, {message: 'equipment removed'});
    });
  });
}

function addGroupEquipment(request, callback) {
  var tripId = request.params.id;
  var equipmentName = request.body.equipmentName;
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('INSERT INTO trip_equipment (trip_id, equipment, is_group) VALUES ($1, $2, $3)', [tripId, equipmentName, true], function(err){
      if(err){
        done(err);
        return callback(err)
      }
      done();
      return callback(null, {message: 'equipment added'});
    });
  });
}

function claimEquipment(id, userid, callback) {
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('UPDATE trip_equipment SET responsible=$1 WHERE id=$2;', [userid, id], function(err){
      if(err){
        done(err);
        return callback(err)
      }
      done();
      return callback(null, {message: 'equipment assigned'});
    });
  });
}

function unclaimEquipment(id, callback) {
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('UPDATE trip_equipment SET responsible=null WHERE id=$1;', [id], function(err){
      if(err){
        done(err);
        return callback(err)
      }
      done();
      return callback(null, {message: 'equipment unassigned'});
    });
  });
}

function createMenu(duration, tripId) {
  var tripMenu = {};
  tripMenu.menu = [];
  tripMenu.tripId = tripId;
  for (var i = 1; i <= duration + 1; i++) {
    var menuDay = {};
    menuDay.day = i;
    menuDay.breakfast = [];
    menuDay.lunch = [];
    menuDay.dinner = [];
    tripMenu.menu.push(menuDay);
  }
  var addedMenu = new Menu(tripMenu);
  addedMenu.save(function(err){
    if(err){
      console.log('Error Creating Menu');
    }
  })
}

module.exports = {
  getOverview: getOverview,
  getGroupEquipment: getGroupEquipment,
  newTrip: newTrip,
  joinTrip: joinTrip,
  addPersonalEquipment: addPersonalEquipment,
  addGroupEquipment: addGroupEquipment,
  removeEquipment: removeEquipment,
  claimEquipment: claimEquipment,
  unclaimEquipment: unclaimEquipment
};
