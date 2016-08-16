var pool = require('./db');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

function findByUsername(username, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      done();
      return callback(err);
    }
    client.query('SELECT * FROM users WHERE username=$1', [username], function(err, result){
      if(err) {
        done();
        return callback(err);
      }
      callback(null, result.rows[0]);
      done();
    });
  });
};

function findById(id, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      done();
      return callback(err);
    }
    client.query('SELECT * FROM users WHERE id=$1', [id], function(err, result){
      if(err) {
        done();
        return callback(err);
      }
      callback(null, result.rows[0]);
      done();
    });
  });
};

function passwordCheck(username, candidatePassword, callback) {
  // console.log('password check', username);
  findByUsername(username, function(err, user){
    // console.log('user:', user);
    if(err) {
      console.log(err);
      return callback(err);
    }
    if(!user) {
      console.log('no user found');
      return callback(err);
    }
    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
      if(err){
        console.log('user.js', err);
        callback(err);
      } else {
        // console.log('password match');
        callback(null, isMatch, user);
      }
    });
  });
};

function create(username, password, callback) {
  console.log('Creating User');
  bcrypt.hash(password, SALT_WORK_FACTOR, function(err, hash) {
    pool.connect(function(err, client, done){
      if(err) {
        done();
        return callback(err);
      }
      client.query('INSERT INTO users (username, password) ' +
                  ' VALUES ($1, $2) RETURNING id, username',
                  [username, hash], function(err, result){
        if(err) {
          done();
          return callback(err);
        }
        callback(null, result.rows[0]);
        done();
      });
    });
  });
}

function getTrips(id, callback) {
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('SELECT * FROM trip_assignments JOIN trips ON trip_assignments.trip_id = trips.id WHERE user_id=$1', [id], function(err, trips){
      if(err){
        done(err);
        return callback(err)
      }
      done();
      callback(null, trips.rows);
    });
  });
}

function getPersonalEquipment(userId, tripId, callback) {
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('SELECT * FROM trip_equipment WHERE responsible=$1 AND trip_id=$2 AND is_group=FALSE', [userId, tripId], function(err, equipment){
      if(err){
        done(err);
        return callback(err)
      }
      done();
      callback(null, equipment.rows);
    });
  });
}

function getDefaultEquipment(userId, callback) {
  pool.connect(function(err, client, done) {
    if(err){
      console.log(err);
      done();
      return callback(err);
    }
    client.query('SELECT * FROM default_equipment WHERE user_id=$1', [userId],function(err, equipment){
      if(err){
        console.log(err);
        done();
        return callback(err);
      }
      done();
      return callback(null, equipment.rows);
    })
  })
}

function addDefaultEquipment(userId, equipment, callback) {
  console.log(equipment);
  pool.connect(function(err, client, done){
    if(err){
      console.log(err);
      done();
      return callback(err);
    }
    client.query('INSERT INTO default_equipment (user_id, equipment) VALUES ($1, $2)', [userId, equipment.equipmentName], function(err, result){
      if(err){
        console.log(err);
        done();
        return callback(err);
      }
      done();
      return callback(null);
    })
  })
}

function removeDefaultEquipment(equipment_id, callback) {
  console.log('Equipment ID:', equipment_id);
  pool.connect(function(err, client, done){
    if(err){
      console.log(err);
      done();
      return callback(err);
    }
    client.query('DELETE FROM default_equipment WHERE id=$1', [equipment_id], function(err, result){
      if(err){
        console.log(err);
        done();
        return callback(err);
      }
      console.log('removed item');
      done();
      return callback(null);
    })
  })
}

function updateProfile(user, callback) {
  var email = user.email;
  var phone = user.phone;
  var id = user.id;
  console.log('updating profile?', phone, email);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log(err);
      done();
      return callback(err);
    }
    client.query('UPDATE users SET email=$1, phone=$2 WHERE id=$3', [email, phone, id], function(err) {
      if(err) {
        console.log(err);
        done();
        return callback(err);
      }
      done();
      console.log('Updated');
      return callback(null);
    });
  });
}

// function getUserProfile(id, callback) {
//   findById(id, function(err, user))
// }


module.exports = {
  findByUsername: findByUsername,
  findById: findById,
  create: create,
  passwordCheck: passwordCheck,
  getTrips: getTrips,
  getPersonalEquipment: getPersonalEquipment,
  getDefaultEquipment: getDefaultEquipment,
  addDefaultEquipment: addDefaultEquipment,
  updateProfile: updateProfile,
  removeDefaultEquipment: removeDefaultEquipment
};
