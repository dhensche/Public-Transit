var http = require('http'),
		fs = require('fs'),
		events = require('events'),
		options = {
			host: 'ebongo.org'
		};

var Route = function(route) {
	var self = this;
	options.path = '/api/route?agency=' + route.agency + '&route=' + route.tag;
	options.path += '&format=json';
	http.request(options, function(res) {
		var jsonstring = '';
	
		res.on('data', function(chunk) {
			jsonstring += chunk;
		});
		res.on('end', function() {
			self.data = JSON.parse(jsonstring);
			self.emit('data', self.data);
		});
	}).end();
};

Route.prototype = new events.EventEmitter;
module.exports = Route;