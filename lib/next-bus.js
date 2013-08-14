var request = require('request'),
    parser = require('xml2js').parseString,
    uri = 'http://webservices.nextbus.com/service/xmlFeed';
    
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
      cb(rawRoutes.map(function(route) {return route.$}));
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
        cb(result);
      } else {
        cb(undefined);
      }
    });
  });
  
}