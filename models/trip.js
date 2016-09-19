var pool = require('./db');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Menu = require('./menu.js');
var SALT_WORK_FACTOR = 10;

function getOverview(request, callback) {
  var data = {};
  var tripId = request.tripId;
  var userId = request.userId;
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
      client.query('SELECT id, trip_name, organizer_id, date, location, duration, notes FROM trips WHERE id=$1', [tripId], function(err, info) {
        if(err){
          done(err);
          return callback(err);
        }
        client.query('SELECT * FROM trip_equipment WHERE trip_id=$1 AND responsible=$2 AND is_group=FALSE', [tripId, userId], function(err, personalEquip) {
          if(err){
            done(err);
            return callback(err);
          }
          getMessages(tripId, function(err, messages) {
            if(err){
              done(err);
              return callback(err);
            }
            getGroupEquipment(tripId, function(err, groupEquip) {
              if(err){
                done(err);
                return callback(err);
              }
              data.equipment = {};
              data.equipment.personal = personalEquip.rows;
              data.equipment.group = groupEquip;
              data.users = users.rows;
              data.info = info.rows[0];
              data.messages = messages;
              done();
              callback(null, data);
            })
          })
        });
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
    client.query('SELECT trip_equipment.id, trip_id, equipment, username, users.id as user_id, is_group FROM trip_equipment LEFT OUTER JOIN users ON trip_equipment.responsible = users.id WHERE trip_id=$1 AND is_group=TRUE', [tripId], function(err, equipment){
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

function copyTrip(request, oldId, callback) {
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
          client.query('SELECT * FROM trip_equipment WHERE trip_id=$1', [oldId], function(err, oldEquipment) {
            if(err) {
              done(err);
              return callback(err);
            }
            var newEquip = [];
            for (var i = 0; i < oldEquipment.rows.length; i++) {
              if(oldEquipment.rows[i].responsible != organizerId) {
                oldEquipment.rows[i].responsible = null;
              }
              if(oldEquipment.rows[i].responsible === organizerId || oldEquipment.rows[i].is_group === true) {
                client.query('INSERT INTO trip_equipment (trip_id, equipment, is_group, responsible) VALUES ($1, $2, $3, $4) RETURNING id, equipment, is_group, responsible', [trip.rows[0].id, oldEquipment.rows[i].equipment, oldEquipment.rows[i].is_group, oldEquipment.rows[i].responsible],
                  function(err, equipResult) {
                    if(err) {
                    done(err);
                    return callback(err);
                    }
                    newEquip.push(equipResult);
                  }
                )
              }
            }
            Menu.find({tripId: oldId}, function(err, menu){
              if(err) {
                done(err);
                callback(err)
              }
              done();
              copyMenu(trip.rows[0].id, menu);
              return callback(null, trip.rows);
            })
          })
        })
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
    client.query('SELECT id, access_code FROM trips WHERE id=$1',[request.body.id], function(err, trip){
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

function leaveTrip(request, isOrg, callback) {
  var userId = request.user.id;
  var tripId = request.params.id;
  var organizer = isOrg;
  pool.connect(function(err, client, done) {
    if(err){
      done();
      return callback(err);
    }
    if(organizer === 'true') {
      client.query('DELETE FROM trips WHERE id=$1', [tripId], function(err) {
        if(err) {
          done(err);
          return callback(err);
        }
        done();
        return callback(null, {message: 'trip deleted'});
      });
    } else {
      client.query('DELETE FROM trip_assignments WHERE trip_id=$1 AND user_id=$2', [tripId, userId], function(err){
        if(err){
          done(err);
          return callback(err)
        }
        client.query('DELETE FROM trip_equipment WHERE trip_id=$1 AND responsible=$2 AND is_group=FALSE', [tripId, userId], function(err) {
          if(err){
            done(err);
            return callback(err)
          }
          client.query('UPDATE trip_equipment SET responsible=null WHERE trip_id=$1 AND responsible=$2 AND is_group=TRUE', [tripId, userId], function(err) {
            if(err){
              done(err);
              return callback(err)
            }
            done();
            return callback(null, {message: 'User Removed from Trip'});
          });
        });
      });
    }
  });
}

function addPersonalEquipment(request, callback) {
  var tripId = request.params.tripid;
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
  var tripId = request.params.tripid;
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

function copyMenu(tripId, menu) {
  var tripMenu = {};
  tripMenu.menu = menu[0].menu;
  tripMenu.tripId = tripId;
  var menu = new Menu(tripMenu);
  menu.save(function(err) {
    if(err) {
      console.log('Error Copying Menu');
    }
    console.log('Menu Saved');
  });
}

function createMenu(duration, tripId) {
  var tripMenu = {};
  tripMenu.menu = [];
  tripMenu.tripId = tripId;
  for (var i = 1; i <= duration + 1; i++) {
    var menuDay = {};
    menuDay.day = i;
    menuDay.dinner = [];
    menuDay.lunch = [];
    menuDay.breakfast = [];
    tripMenu.menu.push(menuDay);
  }
  var menu = new Menu(tripMenu);
  menu.save(function(err){
    if(err){
      console.log('Error Creating Menu');
    }
  })
}

function sendMessage(request, callback) {
  var tripId = request.tripId;
  var userId = request.userId;
  var message = request.message;
  var timeStamp = request.timeStamp;
  pool.connect(function(err, client, done) {
    if(err){
      done();
      return callback(err);
    }
    client.query('INSERT INTO trip_messages (trip_id, user_id, message, time_stamp) VALUES ($1, $2, $3, $4)',
                [tripId, userId, message, timeStamp],
                function(err) {
      if(err){
        done();
        return callback(err);
      }
      done();
      return callback(null, {message: 'Message Added'});
    });
  });
}

function getMessages(tripId, callback) {
  pool.connect(function(err, client, done) {
    if(err){
      done();
      return callback(err);
    }
    client.query('SELECT m.id, u.id as user_id, u.username, t.id as trip_id, m.message, m.time_stamp FROM trip_messages AS m ' +
                'JOIN users AS u ON m.user_id = u.id ' +
                'JOIN trips AS t ON m.trip_id = t.id ' +
                'WHERE m.trip_id=$1', [tripId],
                function(err, messages) {
      if (err) {
        done();
        return callback(err);
      }
      done();
      return callback(null, messages.rows);
    })
  })
}

function deleteMessage(id, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      done();
      return callback(err);
    }
    client.query('DELETE FROM trip_messages WHERE id=$1', [id], function(err) {
      if(err) {
        done();
        return callback(err);
      }
      done();
      return callback(null);
    });
  });
}

function editLocation(id, newLocation, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      console.log(err);
      done();
      return callback(err);
    }
    client.query('UPDATE trips SET location=$1 WHERE id=$2', [newLocation, id], function(err) {
      if(err){
        done();
        return callback(err);
      }
      done();
      return callback(null);
    })
  })
}

function editDate(id, newDate, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      console.log(err);
      done();
      return callback(err);
    }
    client.query('UPDATE trips SET date=$1 WHERE id=$2', [newDate, id], function(err) {
      if(err){
        done();
        return callback(err);
      }
      done();
      return callback(null);
    })
  })
}

function editNotes(id, notes, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      console.log(err);
      done();
      return callback(err);
    }
    client.query('UPDATE trips SET notes=$1 WHERE id=$2', [notes, id], function(err) {
      if(err){
        done();
        return callback(err);
      }
      done();
      return callback(null);
    })
  })
}

function editDuration(id, newDuration, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      console.log(err);
      done();
      return callback(err);
    }
    client.query('UPDATE trips SET duration=$1 WHERE id=$2', [newDuration, id], function(err) {
      if(err){
        done();
        return callback(err);
      }
      done();
      return callback(null);
    })
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
  unclaimEquipment: unclaimEquipment,
  sendMessage: sendMessage,
  getMessages: getMessages,
  deleteMessage: deleteMessage,
  leaveTrip: leaveTrip,
  editLocation: editLocation,
  editDate: editDate,
  editDuration: editDuration,
  copyTrip: copyTrip,
  editNotes: editNotes
};
