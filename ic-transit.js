var NextBus = require('./lib/next-bus.js'),
util = require('util');

NextBus.routes('uiowa', function(routes) {
  console.log(util.inspect(routes, {depth: 5}));
});