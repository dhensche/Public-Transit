var request = require('request'),
    parser = require('xml2js').parseString,
    uri = 'http://webservices.nextbus.com/service/xmlFeed';
    
function flatten(prop) {
  return prop.$;
}
    
exports.routes = function routes(agency, cb) {
  request.get({
    uri: uri,
    qs: {
      command: 'routeList',
      a: agency
    }
  }, function(e, r, xml) {
    parser(xml, function(err, result) {
      var rawRoutes = result.body.route || [];
      cb(rawRoutes.map(flatten));
    });
  });
}

exports.route = function route(agency, route, cb) {
  request.get({
    uri: uri,
    qs: {
      command: 'routeConfig',
      a: agency,
      r: route
    }
  }, function(e, r, xml) {
    parser(xml, function(err, result) {
      if (result.body.route) {
        var rawRoute = result.body.route[0],
        direction = rawRoute.direction[0],
        paths = rawRoute.path,
        parsedRoute = rawRoute.$;
        
        parsedRoute.stops = rawRoute.stop.map(flatten);
        parsedRoute.direction = direction.$;
        parsedRoute.direction.stops = direction.stop.map(flatten);
        parsedRoute.paths = paths.map(function(path) {
          return path.point.map(flatten);
        });
    
        cb(parsedRoute);
      } else {
        cb(undefined);
      }
    });
  });
  
}