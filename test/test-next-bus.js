var should = require('should'),
    NextBus = require('../lib/next-bus');
    
function nonEmptyArray(prop) {
  prop.should.be.an.instanceof(Array).and.not.be.empty;
}

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
        nonEmptyArray(routes);
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
      it('should have tag, title and direction properties', function() {
        route.should.have.property('tag');
        route.should.have.property('title');
        route.should.have.property('direction');
      });
      it('should have a non-empty array property stops', function() {
        nonEmptyArray(route.stops);
      });
      it('should have a non-empty array property paths', function() {
        nonEmptyArray(route.paths);
      });
      
      describe('stops', function() {
        it('should have objects with tag, title and stopId properties', function() {
          route.stops.forEach(function(stop) {
            stop.should.have.property('tag');
            stop.should.have.property('title');
            should.exist(stop.stopId || stop.hidden);
          });
        });
      });
      
      describe('direction', function() {
        it('should have tag and title properties', function() {
          var direction = route.direction;
          direction.should.have.property('tag');
          direction.should.have.property('title');
        })
        it('should have non-empty array property stops', function() {
          nonEmptyArray(route.direction.stops);
        });
        
        describe('stops', function() {
          it('should have property tag', function() {
            route.direction.stops.forEach(function(stop) {
              stop.should.have.property('tag');
            });
          });
        });
      });
      
      describe('paths', function() {
        it('should have objects with non-empty array property points', function() {
          route.paths.forEach(function(path) {
            nonEmptyArray(path);
          })
        });
        
        describe('points', function() {
          it('should have lat and lon properties', function() {
            route.paths.forEach(function(points) {
              points.forEach(function(point) {
                point.should.have.property('lat');
                point.should.have.property('lon');
              })
            });
          });
        });
      });
    });
  });
});