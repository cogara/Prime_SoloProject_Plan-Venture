var pg = require('pg');

var config = {
  user: 'postgres',
  password: 'postgres',
  database: 'planventure',
  port: 5432,
  max: 5,
  idleTimeoutMillis: 30000
};

module.exports = new pg.Pool(config);
