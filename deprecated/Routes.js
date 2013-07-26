var http = require('http'),
		fs = require('fs'),
		Route = require('./Route'),
		Progress = require('./Progress'),
		events = require('events'),
		options = {
			host: 'ebongo.org',
			path: '/api/routelist?format=json'
		};

var Routes = function() {
	var self = this;
	
	self.progress = new Progress('Routes');
	http.request(options, function(res) {
		var jsonstring = '';
	
		res.on('data', function(chunk) {
			jsonstring += chunk;
		});
		res.on('end', function() {
			self.data = JSON.parse(jsonstring);
			self.emit('data', self.data);
			createRoutesFile(self.data.routes, self);
			self.emit('done');
		});
	}).end();
};

Routes.prototype = new events.EventEmitter;
module.exports = Routes;


var createRoutesFile = function(routes, self) {
	var data = 'route_id,agency_id,route_short_name,route_long_name,',
			routesleft = routes.length;
	
	self.routes = [];
	data += 'route_type,route_url\r\n';
	
	routes.forEach(function(item) {
		var r = new Route(item.route);
		r.on('data', function(routeObj) {
			var route = routeObj.route;
			data += route.tag + ',' + route.agencytag + ',';
			data += ',' + route.name + ',3,http://ebongo.org/routes/';
			data += route.agencytag + '/' + route.tag + '\r\n';
			routesleft--;
			self.routes.push(route);
			if (routesleft === 0) {
				fs.writeFileSync('routes.txt', data, 'utf8');
				self.emit('routes', self.routes);
			}
			
			self.progress.tick(Math.round(((routes.length - routesleft) * 100.0) / (routes.length - 1)));
		});
	});
};