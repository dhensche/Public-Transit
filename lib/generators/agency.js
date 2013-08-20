var util = require('util'),
    events = require('events'),
    fs = require('fs'),
    basedir = __dirname + '/../../';

var Agency = function() {
  this.generate = function generate() {
    var file = basedir + 'config/agency.csv';

    fs.readFile(file, {encoding: 'utf8'}, function(err, data) {
      fs.mkdir(basedir + 'dist', function() {
        var output = basedir + 'dist/agency.txt';
        fs.writeFile(output, data, {encoding: 'utf8'}, function() {
          this.emit('done');
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
}

util.inherits(Agency, events.EventEmitter);
module.exports = Agency;