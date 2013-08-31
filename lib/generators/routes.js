var util = require('util'),
    events = require('events'),
    csv = require('csv'),
    fs = require('fs'),
    path = require('path'),
    Bongo = require('../ebongo'),
    NextBus = require('../next-bus'),
    basedir = path.join(__dirname, '../..');
    

var Routes = function Routes() {
  this.generate = function generate() {
    Bongo.routelist(function(routes) {
      csv().from.array(routes)
      .to.path(
        path.join(basedir, 'dist/routes.txt'),
        {
          columns: ['route_id', 'agency_id', 'route_short_name', 
                    'route_long_name', 'route_type', 'route_url'],
          header: true,
          flags: 'w'
        }
      ).transform(function(data, i, cb) {
        var route = data.route;

        NextBus.route(route.agency, route.tag, function(rte) {
          cb(null, {
            route_id: route.tag,
            agency_id: route.agency,
            route_short_name: rte.shortName || '',
            route_long_name: route.name,
            route_type: 3,
            route_url: 'http://ebongo.org/routes/' + route.agency + '/' + route.tag
          });
        });
      }).on('close', function() {
        this.emit('done');
      }.bind(this));
    }.bind(this));
  }
}
util.inherits(Routes, events.EventEmitter);
module.exports = Routes;