var Routes = require('./Routes'),
		Stops = require('./Stops'),
		Calendar = require('./Calendar'),
		Trips = require('./Trips'),
		Agency = require('./Agency'),
		async = require('async'),
		child = require('child_process');

child.exec('mkdir transit_files', function() {
	process.chdir('./transit_files');
	async.parallel([
		function(callback) {
			new Routes().on('routes', function(routes) {
				new Trips(routes).on('done', function() {
					callback();
				});
			});
		},
		function(callback) {
			new Stops().on('done', function() {
				process.stdout.write('Stops done\n\r');
				callback();
			});
		},
		function(callback) {
			new Calendar().on('done', function() {
				process.stdout.write('Calendar done\n\r');
				callback();
			});
		},
		function(callback) {
			new Agency().on('done', function() {
				process.stdout.write('Agency done\n\r');
				callback();
			});
		}
	], 
	function(err, results) {
		process.chdir('..');

		child.exec('rm transit_feed.zip', function() {
			child.exec('zip -j transit_feed transit_files/*', function() {
				child.exec('rm -r transit_files');
			});
		});
	});
});