var expect = require('chai').expect;
var coursebook = require('./');

describe('coursebook', function() {
  it('should ...', function(done) {
    coursebook.search('15s', 'cs').then(function(res) {
      console.log(res);
      done();
    });
  });
});
