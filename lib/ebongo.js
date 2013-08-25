var request = require('request'),
    uri = 'http://api.ebongo.org';
    
exports.routelist = function(cb) {
  request.get({
    uri: uri + '/routelist',
    qs: {format: 'json'}
  }, function(e, r, data) {
    cb(JSON.parse(data).routes);
  });
}

exports.stoplist = function(cb) {
  request.get({
    uri: uri + '/stoplist',
    qs: {format: 'json'}
  }, function(e, r, data) {
    cb(JSON.parse(data).stops);
  });
}

exports.stopinfo = function(stopid, cb) {
  request.get({
    uri: uri + '/stop',
    qs: {format: 'json', stopid: stopid}
  }, function(e, r, data) {
    var stop = JSON.parse(data).stopinfo;
    cb(stop.stopid ? stop : null);
  });
}