var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    Routes = require('../../lib/generators/routes');
    
describe('routes', function() {
  it('should have generate property', function() {
    new Routes().should.have.property('generate');
  });
  
  it('should emit "done" event when done', function(done) {
    var routes = new Routes();
    routes.on('done', function() {
      done();
    });
    routes.generate();
  });
  
  it('should have created routes.txt in dist/ when done', function(done) {
    var routes = new Routes();
    routes.on('done', function() {
      var file = path.join(__dirname, '../..', 'dist/routes.txt');
      fs.exists(file, function(exists) {
        exists.should.be.true;
        done();
      });
    });
    routes.generate();
  });
});