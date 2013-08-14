var request = require('request'),
    parser = require('xml2js').parseString;
    
exports.routes = function routes(agency, cb) {
  request.get({
    uri: 'http://webservices.nextbus.com/service/xmlFeed',
    qs: {
      command: 'routeList',
      a: agency
    }
  }, function(e, r, xml) {
    parser(xml, function(err, result) {
      var rawRoutes = result.body.route || []
      cb(rawRoutes.map(function(route) {return route.$}));
    });
  });
}