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

        // Parse
        var c0 = $($r[0]);
        var term = c0.clone().children().remove().end().text();
        var status = $(c0.children('span')[0]).text();

        var c1 = $($r[1]);
        var section = $(c1.children('a')[0]).text();
        var num = c1.clone().children().remove().end().text();

        var title = $($r[2]).text();

        var instructors = [];
        $($r[3]).children('a').each(function() {
          instructors.push($(this).text().trim());
        });

        var c4 = $($r[4]);
        var schedule = c4.clone().children().remove().end().text();
        var loc = $(c4.children('a')[0]).text();

        var fill = $($($r[5]).children('div')[0]).attr('title').split(' ')[0];

        ret.push({
          term: term,
          status: status,
          section: section,
          num: num,
          title: title,
          instructors: instructors,
          schedule: schedule,
          loc: loc,
          fill: fill
        });
      });
      return ret;
    });
  }
};

