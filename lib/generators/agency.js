var util = require('util'),
    events = require('events'),
    fs = require('fs'),
    path = require('path'),
    basedir = path.join(__dirname, '../..');

var Agency = function Agency() {
  this.generate = function generate() {
    var file = path.join(basedir, 'config/agency.csv');
    
    fs.readFile(file, {encoding: 'utf8'}, function(err, data) {
      fs.mkdir(path.join(basedir, 'dist'), function() {
        var output = path.join(basedir, 'dist/agency.txt');
        fs.writeFile(output, data, {encoding: 'utf8'}, function() {
          this.emit('done');
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
}

util.inherits(Agency, events.EventEmitter);
module.exports = Agency;