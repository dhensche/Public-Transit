var http = require('http'),
		fs = require('fs'),
		Routes = require('./Routes'),
		events = require('events'),
		xml2js = require('xml2js'),
		util = require('util'),
		Progress = require('./Progress'),
		blockMap = JSON.parse(fs.readFileSync('conf/block_map.json', 'utf8'));

var Trips = function(routes) {
	var self = this,
			parser = new xml2js.Parser(),
			progress = new Progress('Trips and Stop Times');
	
	self.tripsContent = ['route_id,service_id,trip_id,trip_headsign,direction_id\r\n'],
	self.stopTimesContent = ['trip_id,arrival_time,departure_time,stop_id,stop_sequence,stop_headsign\r\n'];
	self.numberFinished = 0;
	
	self.on('complete', function(self) {
		fs.writeFileSync('trips.txt', self.tripsContent.join(''), 'utf8');
		fs.writeFileSync('stop_times.txt', self.stopTimesContent.join(''), 'utf8');
		self.emit('done');
	});
	
	routes.forEach(function(r) {
		http.request({
			host: 'webservices.nextbus.com',
			path: '/service/xmlFeed?command=schedule&a=' + r.agencytag + '&r=' + r.tag
		}, function(res) {
			var xmlstring = '';
	
			res.on('data', function(chunk) {
				xmlstring += chunk;
			});
			res.on('end', function() {
				parser.parseString(xmlstring, function(err, rr) {
					if (rr.route) {
						tripsBuilder(rr, r, self);
					}
					
					self.numberFinished++;
					var pc = Math.round((self.numberFinished * 100.0) / routes.length);
					progress.tick(pc);
					if (self.numberFinished === routes.length) {
						self.emit('complete', self);
					}
				});
			});
		}).end();
	});
};

Trips.prototype = new events.EventEmitter;
module.exports = Trips;

var tripsBuilder = function(nextRoute, ebongoRoute, self) {
	var routeId = ebongoRoute.tag,
			tripHeadsign = ebongoRoute.name,
			services = blockMap[ebongoRoute.agencytag][routeId],
			trips = self.tripsContent,
			stopTimesContent = self.stopTimesContent;
	
	Object.keys(services).forEach(function(serviceId) {
		var blocks = services[serviceId],
				prevDirection;
		
		if(serviceId === 'unknown') {
			return;
		}
		
		nextRoute.route = wrap(nextRoute.route);

		nextRoute.route.forEach(function(route) {
			var directionId = route['@'].direction,
					tripCount = 0,
					directionFlag;
			
			if (!prevDirection) {
				directionFlag = 0;
			} else if (prevDirection != directionId) {
				directionFlag = 1;
			}
			
			prevDirection = directionId;
			route.tr = wrap(route.tr);
			
			route.tr.forEach(function(trip) {
				var tripId = routeId + '_' + serviceId + '_' + directionId + '_' + tripCount;
				if (!~services[serviceId].indexOf(parseInt(trip['@'].blockID, 10))) {
					return;
				}
				trips.push(routeId + ',', serviceId + ',');
				trips.push(tripId + ',');
				trips.push('"' + tripHeadsign + '",', directionFlag + '\r\n');
				tripCount++;
				
				ebongoRoute.directions = wrap(ebongoRoute.directions);
				
				ebongoRoute.directions.forEach(function(direction) {
					var stopCount = 1,
							firstTime = '';
					if (direction.directiontag === directionId) {
						direction.stops = wrap(direction.stops);
						
						direction.stops.forEach(function(stop) {
							var stopId = stop.stopnumber,
									stopHeadsign = stop.stoptitle,
									time = '';
									
							route.header.stop = wrap(route.header.stop);
							
							route.header.stop.forEach(function(metaStop) {
								if (metaStop['#'] === stopHeadsign) {
									trip.stop = wrap(trip.stop);
									
									trip.stop.forEach(function(timeStop) {
										if (metaStop['@'].tag === timeStop['@'].tag && timeStop['#'] != '--') {
											time = timeStop['#'];
											if (!firstTime) {
												firstTime = time;
											} else if(parseInt(firstTime.split(':')[0],10) > parseInt(time.split(':')[0],10)) {
												var splitTime = time.split(':');
												splitTime[0] = (parseInt(splitTime[0],10) + 24) + '';
												time = splitTime.join(':');
											}
										}
									});
								}
							});
							
							stopTimesContent.push(tripId + ',' + time + ',' + time + ',');
							stopTimesContent.push(stopId + ',' + stopCount + ',');
							stopTimesContent.push('"' + stopHeadsign + '"\r\n');
							stopCount++;
						});
					}
				});
			});
			
		});
	});
};

var wrap = function(obj) {
	return util.isArray(obj) ? obj : [obj];
};