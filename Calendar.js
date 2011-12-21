var https = require('https'),
		fs = require('fs'),
		events = require('events'),
		dateFormat = require('dateformat'),
		util = require('util'),
		async = require('async'),
		format = "yyyymmdd",
		calendarTemplate = fs.readFileSync('conf/calendar_map.json', 'utf8'),
		now = new Date();

var Calendar = function() {
	var self = this,
			yearStart = now, 
			yearEnd = now,
			spring, summer, fall, winter, current;
			
	// replace year start values
	yearStart.setMonth(0);
	yearStart.setDate(1);
	calendarTemplate = calendarTemplate.replace(/year_start/g, dateFormat(yearStart, format));
	
	// replace year end values
	yearEnd.setMonth(11);
	yearEnd.setDate(31);
	calendarTemplate = calendarTemplate.replace(/year_end/g, dateFormat(yearEnd, format));
	
	// replace values related to academic calendar
	https.request({
		host: 'www.maui.uiowa.edu',
		path: '/maui/api/pub/registrar/sessions/current',
		headers: {
			'Accept' : 'application/json'
		}
	}, function(res){
		var jsonstring = '';
	
		res.on('data', function(chunk) {
			jsonstring += chunk;
		});
		res.on('end', function() {
			current = JSON.parse(jsonstring);
			manageAcademicDates(current, self);
		});
	}).end();
};

Calendar.prototype = new events.EventEmitter;
module.exports = Calendar;

var manageAcademicDates = function(current, self) {
	var regExSwitch = {
				Spring: 0,
				Summer: 1,
				Fall: 2,
				Winter: 3
			}, 
			type = regExSwitch[current.shortDescription.split(' ')[0]],
			stepsForward = 3 - type,
			stepsBackward = type,
			basepath = '/maui/api/pub/registrar/sessions/range?from=' + current.id + '&steps='
			options = {
				host: 'www.maui.uiowa.edu',
				headers: {
					'Accept' : 'application/json'
				}
			};
	
	async.parallel([
		function(callback) {
			if (stepsForward === 0) {
				callback(null, []);
			} else {
				options.path = basepath + stepsForward;
				https.request(options, function(res) {
					var jsonstring = '';
					
					res.on('data', function(chunk) {jsonstring += chunk});
					
					res.on('end', function() {
						callback(null, [JSON.parse(jsonstring)[0]]);
					});
				}).end();
			}
		},
		function(callback) {
			if (stepsBackward === 0) {
				callback(null, []);
			} else {
				options.path = basepath + '-' + stepsBackward;
				https.request(options, function(res) {
					var jsonstring = '';
					
					res.on('data', function(chunk) {jsonstring += chunk});
					
					res.on('end', function() {
						callback(null, JSON.parse(jsonstring));
					});
				}).end();
			}
		}
	],
	function(err, results) {
		var sessions = results[0].concat(results[1]).reverse();
		
		sessions.forEach(function(session) {
			var descriptor = session.shortDescription.split(' ')[0].toLowerCase(),
					start = new Date(session.startDate),
					end = new Date(session.endDate);
			
			calendarTemplate = calendarTemplate.replace(new RegExp(descriptor + '_start', 'g'),
					dateFormat(start, format));
			calendarTemplate = calendarTemplate.replace(new RegExp(descriptor + '_end', 'g'),
					dateFormat(end, format));
		});
		
		self.data = JSON.parse(calendarTemplate);
		self.emit('data', self.data);
		createCalendarFile(self.data);
		self.emit('done');
	});
};

var createCalendarFile = function(services) {
	var data = 'service_id,monday,tuesday,wednesday,thursday,friday,';
	data += 'saturday,sunday,start_date,end_date\r\n';
	
	for (service in services) {
		if (services.hasOwnProperty(service)) {
			var attrs = services[service],
					attrString = [];
			data += service + ',';
			for (attr in attrs) {
				if (attrs.hasOwnProperty(attr)) {
					attrString.push(attrs[attr]);
				}
			}
			data += attrString.join(',');
			data += '\r\n';
		}
	}

	fs.writeFileSync('calendar.txt', data, 'utf8');
};
