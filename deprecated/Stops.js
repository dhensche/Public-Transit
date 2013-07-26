var http = require('http'),
		fs = require('fs'),
		events = require('events'),
		options = {
			host: 'ebongo.org',
			path: '/api/stoplist?format=json'
		};

var Stops = function() {
	var self = this;
	http.request(options, function(res) {
		var jsonstring = '';
	
		res.on('data', function(chunk) {
			jsonstring += chunk;
		});
		res.on('end', function() {
			self.data = JSON.parse(jsonstring);
			self.emit('data', self.data);
			createStopsFile(self.data.stops);
			self.emit('done');
		});
	}).end();
};

Stops.prototype = new events.EventEmitter;
module.exports = Stops;


var createStopsFile = function(stops) {
	var data = 'stop_id,stop_name,stop_lat,stop_lon,';
	data += 'stop_url\r\n';
	
	stops.forEach(function(item) {
		var stop = item.stop;
		data += stop.stopnumber + ',"' + stop.stoptitle + '",';
		data += stop.stoplat + ',' + stop.stoplng + ',http://ebongo.org/stop/';
		data += stop.stopnumber + '/\r\n';
	});
	fs.writeFileSync('stops.txt', data, 'utf8');
};