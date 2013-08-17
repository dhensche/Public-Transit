var NextBus = require('./lib/next-bus.js'),
util = require('util');

NextBus.schedule('uiowa', 'blue', function(routes) {
  console.log(util.inspect(routes, {depth: 5}));
});