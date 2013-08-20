var util = require('util'),
    events = require('events'),
    fs = require('fs');

var Agency = function() {
  this.generate = function generate() {
    this.emit('done');
  }
}

util.inherits(Agency, events.EventEmitter);
module.exports = Agency;