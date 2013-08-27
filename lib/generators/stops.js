var util = require('util'),
    events = require('events'),
    csv = require('csv'),
    fs = require('fs'),
    path = require('path'),
    Bongo = require('../ebongo')
    basedir = path.join(__dirname, '../..');
    

var Stops = function Stops() {
  this.generate = function generate() {
    Bongo.stoplist(function(stops) {
      csv().from.array(stops)
      .to.path(
        path.join(basedir, 'dist/stops.txt'),
        {
          columns: ['stop_id', 'stop_name', 'stop_lat', 
                    'stop_lon', 'stop_url', 'wheelchair_boarding'],
          header: true,
          flags: 'w'
        }
      ).transform(function(data) {
        var stop = data.stop;
        return {
          stop_id: stop.stopnumber,
          stop_name: stop.stoptitle,
          stop_lat: stop.stoplat,
          stop_lon: stop.stoplng,
          stop_url: 'http://ebongo.org/stop/' + stop.stopnumber,
          wheelchair_boarding: 1
        }
      }).on('close', function() {
        this.emit('done');
      }.bind(this));
    }.bind(this));
  }
}
util.inherits(Stops, events.EventEmitter);
module.exports = Stops;