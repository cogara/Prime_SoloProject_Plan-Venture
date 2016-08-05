var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
  tripId: Number,
  menu: Array
});

var Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
