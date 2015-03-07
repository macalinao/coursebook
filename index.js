var cheerio = require('cheerio');
var request = require('superagent-bluebird-promise');

var SEARCH_BASE = 'http://coursebook.utdallas.edu/search/searchresults/';

module.exports = {
  search: function(term, dept) {
    return request.get(SEARCH_BASE + 'term_' + term + '/cp_' + dept).promise().then(function(res) {
      var $ = cheerio.load(res.text);
      var ret = [];
      $('.section-list table tbody tr').each(function() {
        var $r = $(this).children('td');
        var term = $($r[0]).clone().children().remove().end().text();
        var c1 = $($r[1]);
        var section = $(c1.children('a')[0]).text();
        var num = c1.clone().children().remove().end().text();
        ret.push({
          term: term,
          section: section,
          num: num
        });
      });
      return ret;
    });
  }
};

