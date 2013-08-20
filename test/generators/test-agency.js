var should = require('should'),
    Agency = require('../../lib/generators/agency');
    
describe('agency', function() {
  it('should have generate property', function() {
    new Agency().should.have.property('generate');
  });
  
  it('should emit "done" event when done', function(done) {
    var agency = new Agency();
    agency.on('done', function() {
      done();
    });
    agency.generate();
  });
  
  it('should have created agency.txt in dist/ when done');
})