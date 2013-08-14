var should = require('should'),
    NextBus = require('../lib/next-bus');

describe('NextBus', function() {
  describe('#routes()', function() {
    var routes;
    before(function(done) {
      NextBus.routes('uiowa', function(rts) {
        routes = rts;
        done();
      });
    });
    
    it('should call callback with empty list if no routes found', function(done) {
      NextBus.routes('invalidAgency', function(routes) {
        routes.should.be.empty;
        done();
      });
    });
    
    describe('response', function() {
      it('should not be a nonempty array', function() {
        routes.should.be.an.instanceof(Array).and.not.be.empty;
      });
      
      it('should have objects with tag and title properties', function() {
        routes.forEach(function(route) {
          route.should.have.property('title');
          route.should.have.property('tag');
        });
      });
    });
  });
  
  describe('#route()', function() {
    var route;
    before(function(done) {
      NextBus.route('uiowa', 'red', function(rt) {
        route = rt;
        done();
      });
    });
    
    it('should call callback with undefined if no route found', function(done) {
      NextBus.route('invalid', 'invalid', function(invalid) {
        should.not.exist(invalid);
        done();
      });
    });
    
    describe('response', function() {
      it('should have tag and title properties');
      it('should have a non-empty array property stops');
      it('should have a non-empty array property directions');
      it('should have a non-empty array property paths');
      
      describe('stops', function() {
        it('should have objects with tag, title and stopId properties');
      });
      
      describe('directions', function() {
        it('should have objects with non-empty array property stopTags');
        
        describe('stopTags', function() {
          it('should have property tag');
        });
      });
      
      describe('paths', function() {
        it('should have objects with non-empty array property points');
        
        describe('points', function() {
          it('should have lat and lon properties');
        });
      });
    });
  });
});