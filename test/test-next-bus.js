var should = require('should'),
    NextBus = require('../lib/next-bus');

describe('NextBus', function() {
  describe('#routes(agency, callback)', function() {
    it('should call callback with empty list if no routes found', function(done) {
      NextBus.routes('invalidAgency', function(routes) {
        routes.should.be.empty;
        done();
      });
    });
    
    it('should call callback with list of objects with title and tag props', function(done) {
      NextBus.routes('uiowa', function(routes) {
        routes.should.not.be.empty;
        routes.forEach(function(route) {
          route.should.have.property('title');
          route.should.have.property('tag');
        })
        done();
      });
    });
  });
});