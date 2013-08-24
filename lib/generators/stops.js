var util = require('util'),
    events = require('events'),
    fs = require('fs'),
    path = require('path'),
    basedir = path.join(__dirname, '../..');
    

var Stops = function Stops() {
  this.generate = function generate() {
    this.emit('done');
  }
}
util.inherits(Stops, events.EventEmitter);
module.exports = Stops;