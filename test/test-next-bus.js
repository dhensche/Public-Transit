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
      });
      it('should have a non-empty array property stops', function() {
        nonEmptyArray(route.stops);
      });
      it('should have a non-empty array property paths', function() {
        nonEmptyArray(route.paths);
      });
      it('should have a non-empty array property directions', function() {
        nonEmptyArray(route.directions);
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
      
      describe('directions', function() {
        it('should have objects with tag and title properties', function() {
          route.directions.forEach(function(direction) {
            direction.should.have.property('tag');
            direction.should.have.property('title');
          });
        });
        it('should have objects with non-empty array property stops', function() {
          route.directions.forEach(function(direction) {
            nonEmptyArray(direction.stops);
          });
        });
        
        describe('stops', function() {
          it('should have property tag', function() {
            route.directions.forEach(function(direction) {
              direction.stops.forEach(function(stop) {
                stop.should.have.property('tag');
              });
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
  
  describe('#schedule()', function() {
    var schedule;
    before(function(done) {
      NextBus.schedule('uiowa', 'red', function(sched) {
        schedule = sched;
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
      it('should have tag, title, scheduleClass, serviceClass and direction properties', function() {
        schedule.should.have.property('tag');
        schedule.should.have.property('title');
        schedule.should.have.property('scheduleClass');
        schedule.should.have.property('serviceClass');
        schedule.should.have.property('direction');
      });
      it('should have a nonempty array property stops', function() {
        nonEmptyArray(schedule.stops);
      });
      it('should have a nonempty array property blocks', function() {
        nonEmptyArray(schedule.blocks);
      });
      
      describe('stops', function() {
        it('should have objects with tag and title properties', function() {
          schedule.stops.forEach(function(stop) {
            stop.should.have.property('tag');
            stop.should.have.property('title');
          })
        });
      });
      
      describe('block', function() {
        it('should have objects with blockId property', function() {
          schedule.blocks.forEach(function(block) {
            block.should.have.property('blockId');
          });
        });
        it('should have objects with nonempty array property stops', function() {
          schedule.blocks.forEach(function(block) {
            nonEmptyArray(block.stops);
          });
        });
        
        describe('stops', function() {
          it('should have objects with tag, epochTime and stringTime properties', function() {
            schedule.blocks.forEach(function(block) {
              block.stops.forEach(function(stop) {
                stop.should.have.property('tag');
                stop.should.have.property('epochTime');
                stop.should.have.property('stringTime');
              });
              
            });
          });
        });
      });
    });
  });
  
  describe('#messages()', function() {
    var messages = {};
    before(function(done) {
      NextBus.messages('iowa-city', function(msgs) {
        messages.aMessages = msgs;
        
        NextBus.messages('uiowa', 'blue', function(msgs) {
          messages.rMessages = msgs;
          
          NextBus.messages('uiowa', 'blue', 'red', function(msgs) {
            messages.rMultiMessages = msgs;
            
            NextBus.messages('uiowa', ['blue', 'red'], function(msgs) {
              messages.rListMessages = msgs;
              done();
            });
          });
        });
      });
    });
    
    it('should call callback with empty list if no messages found', function(done) {
      NextBus.messages('invalidAgency', function(messages) {
        messages.should.be.empty;
        done();
      });
    });
    
    it('should not fail if passed no route', function() {
      should.exist(messages.aMessages);
    });
    
    it('should not fail if passed single route', function() {
      should.exist(messages.rMessages);
    });
    
    it('should not fail if passed multiple routes', function() {
      should.exist(messages.rMultiMessages);
    });
    
    it('should not fail if passed list of routes', function() {
      should.exist(messages.rListMessages);
    });
    
    // messages are transient so these tests may fail
    describe('response', function() {
      
      it('should have nonempty array property called routes', function() {
        nonEmptyArray(messages.aMessages);
      });
        
        
      describe('routes', function() {
        it('should have tag property', function() {
          messages.aMessages.forEach(function(route) {
            route.should.have.property('tag');
          });
        });
          
        it('should have nonempty array property messages', function() {
          messages.aMessages.forEach(function(route) {
            // this condition only for messages at Aug 18, 2013
            if(route.tag != 'all') {
              nonEmptyArray(route.messages);
            }
          });
        });
          
        describe('messages', function() {
          it('should have id, creator and sendToBuses properties', function() {
            messages.aMessages.forEach(function(route) {
              route.messages.forEach(function(message) {
                message.should.have.property('id');
                message.should.have.property('sendToBuses');
                message.should.have.property('creator');
                message.should.have.property('text');
              });
            });
          });
                        
          it('should have messageRoutes property for not "all" routes', function() {
            messages.aMessages.forEach(function(route) {
              if(route.tag != 'all') {
                route.messages.forEach(function(message) {
                  nonEmptyArray(message.messageRoutes);
                  message.messageRoutes.forEach(function(route) {
                    route.should.have.property('tag');
                  });
                });
              }
            });
          });
        });
      });
    });
  });
});