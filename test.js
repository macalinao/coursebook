var expect = require('chai').expect;
var coursebook = require('./');

describe('coursebook', function() {

  it('should find details properly', function(done) {
    coursebook.details('cs3354.002.15s').then(function(res) {
      console.log(res);
      done();
    });
  });

/*
  it('should search properly', function(done) {
    coursebook.search('15s', 'cs').then(function(res) {
      console.log(res);
      done();
    });
  });
*/
});
