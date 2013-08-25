var NextBus = require('./lib/next-bus.js'),
  util = require('util');

NextBus.messages('iowa-city', function(routes) {
  console.log(util.inspect(routes, {depth: 6}));
});