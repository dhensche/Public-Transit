var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    Stops = require('../../lib/generators/stops');
    
describe('stops', function() {
  it('should have generate property', function() {
    new Stops().should.have.property('generate');
  });
  
  it('should emit "done" event when done', function(done) {
    var stops = new Stops();
    stops.on('done', function() {
      done();
    });
    stops.generate();
  });
  
  it('should have created stops.txt in dist/ when done', function(done) {
    var stops = new Stops();
    stops.on('done', function() {
      var file = path.join(__dirname, '../..', 'dist/stops.txt');
      fs.exists(file, function(exists) {
        exists.should.be.true;
        done();
      });
    });
    stops.generate();
  });
});