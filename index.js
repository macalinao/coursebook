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
        var c0 = $($r[0]);
        var c1 = $($r[1]);

        // Parse
        var term = c0.clone().children().remove().end().text();
        var status = $(c0.children('span')[0]).text();
        var section = $(c1.children('a')[0]).text();
        var num = c1.clone().children().remove().end().text();
        var title = $($r[2]).text();

        ret.push({
          term: term,
          status: status,
          section: section,
          num: num,
          title: title
        });
      });
      return ret;
    });
  }
};

