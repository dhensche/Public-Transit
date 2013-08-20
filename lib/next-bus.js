var request = require('request'),
    parser = require('xml2js').parseString,
    uri = 'http://webservices.nextbus.com/service/xmlFeed';
    
function flatten(prop) {
  return prop.$;
}

function routeQuery(routes) {
  return routes.length > 0 ? '&r=' + routes.join('&r=') : '';
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
            directions = rawRoute.direction,
            paths = rawRoute.path,
            parsedRoute = rawRoute.$;
        
        parsedRoute.stops = rawRoute.stop.map(flatten);
        parsedRoute.directions = directions.map(function(dir) {
          var direction = dir.$;
          direction.stops = dir.stop.map(flatten);
          return direction;
        });
        
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

exports.schedule = function schedule(agency, route, cb) {
  request.get({
    uri: uri,
    qs: {
      command: 'schedule',
      a: agency,
      r: route
    }
  }, function(e, r, xml) {
    parser(xml, function(err, result) {
      if (result.body.route) {
        var raw = result.body.route[0],
        schedule = raw.$;
            
        schedule.stops = raw.header[0].stop.map(function(stop) {
          return {
            title: stop._,
            tag: stop.$.tag
          };
        });   
        
        schedule.blocks = raw.tr.map(function(block) {
          return {
            blockId: block.$.blockID,
            stops: block.stop.map(function(stop) {
              return {
                tag: stop.$.tag,
                epochTime: stop.$.epochTime,
                stringTime: stop._
              }
            })
          };
        }); 
            
        cb(schedule);
      } else {
        cb(null);
      }
    });
  });
}

exports.messages = function messages() {
  var args = [].slice.call(arguments),
      agency = args[0],
      deepRoutes = args.slice(1, args.length - 1),
      routes = []
      cb = args[args.length - 1]
  routes = [].concat.apply(routes, deepRoutes);
  
  request.get({
    uri: uri + '?command=messages&a=' + agency + routeQuery(routes)
  }, function(e, r, xml) {
    parser(xml, function(err, result) {
      var rawMessages = result.body.route || [],
          messages;
      
      messages = rawMessages.map(function(rte) {
        var route = flatten(rte);
        route.messages = (rte.message || []).map(function(msg) {
          var message = flatten(msg);
          message.messageRoutes = msg.routeConfiguredForMessage.map(flatten);
          message.text = msg.text;
          return message;
        });
        return route;
      });
      cb(messages);
    });
  });
}