var should = require('should'),
    Bongo = require('../lib/ebongo');
    
function nonEmptyArray(prop) {
  prop.should.be.an.instanceof(Array).and.not.be.empty;
}

describe('Bongo', function() {
  describe('#routelist()', function() {
    var routes;
    before(function(done) {
      Bongo.routelist(function(rts) {
        routes = rts;
        done();
      });
    });
    
    it('should call callback with object with nonempty array', function() {
      nonEmptyArray(routes);
    });
    
    describe('response', function() {
      it('should have route property', function() {
        routes.forEach(function(route) {
          route.should.have.property('route');
        });
      });
      
      it('should have name, tag and agency sub properties', function() {
        routes.forEach(function(route) {
          route.route.should.have.property('name');
          route.route.should.have.property('tag');
          route.route.should.have.property('agency');
        });
      });
    });
  });
  
  describe('#stoplist()', function() {
    var stops;
    before(function(done) {
      Bongo.stoplist(function(sts) {
        stops = sts;
        done();
      });
    });
    
    it('should call callback with object with nonempty array', function() {
      nonEmptyArray(stops);
    });
    
    describe('response', function() {
      it('should have stop property', function() {
        stops.forEach(function(stop) {
          stop.should.have.property('stop');
        });
      });
      
      it('should have (stop)(number, title, lat, lng) sub properties', function() {
        stops.forEach(function(stop) {
          stop.stop.should.have.property('stopnumber');
          stop.stop.should.have.property('stoptitle');
          stop.stop.should.have.property('stoplat');
          stop.stop.should.have.property('stoplng');
        });
      });
    });
  });
  
  describe('#stopinfo()', function() {
    var stop;
    before(function(done) {
      Bongo.stopinfo('1', function(stp) {
        stop = stp;
        done();
      });
    });
    
    it('should call callback with null if invalid stopid', function(done) {
      Bongo.stopinfo('1234567890', function(invalid) {
        should.not.exist(invalid);
        done();
      });
    });
    
    describe('response', function() {
      it('should have stopid, stoptitle, latitude, longitude props', function() {
        stop.should.have.property('stopid');
        stop.should.have.property('stoptitle');
        stop.should.have.property('latitude');
        stop.should.have.property('longitude');
      });
      
      it('should have nonempty array property routes', function() {
        nonEmptyArray(stop.routes);
      });
      
      describe('routes', function() {
        it('should have title, tag and agency properties', function() {
          stop.routes.forEach(function(route) {
            route.should.have.property('title');
            route.should.have.property('tag');
            route.should.have.property('agency');
          });
        });
      });
    });
  });
});