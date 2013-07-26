var sprintf = require('sprintf').sprintf;

var Progress = function(descriptor) {
	var self = this;
	self.descriptor = descriptor;
	
	self.tick = function(percentage) {
		var output = sprintf("\r[%'-" + percentage + "s%" + 
			(100 - percentage) + "s %3d%%] %5s progress", 
			'', '', percentage, self.descriptor);
		
		process.stdout.write(output);
		
		if (percentage === 100) {
			process.stdout.write('\n');
		}
	};
}

module.exports = Progress;