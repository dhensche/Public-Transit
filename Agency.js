var fs = require('fs'),
		events = require('events')
		agencyTxt = fs.readFileSync('conf/agency.csv', 'utf8');

var Agency = function() {
	var self = this;
	fs.writeFile('agency.txt', agencyTxt, 'utf8', function() {
		self.emit('done');
	});
};

Agency.prototype = new events.EventEmitter;
module.exports = Agency;