import fs from 'fs';

//import cheerio from 'cheerio';
//import request from 'superagent-bluebird-promise';

const BASE = 'http://coursebook.utdallas.edu/';
const DETAILS_BASE = BASE + 'clips/clip-section.zog';
const SEARCH_BASE = BASE + 'search/searchresults/';

export default {
  departments: fs.readFileSync('./departments.json', 'UTF-8').toString(),

  details(id) {
    return request.get(BASE).promise().then((res) => {
      return request.post(DETAILS_BASE).send({
        id: id,
        div: 'r-lchildcontent',
        subaction: null
      }).set('Cookie', res.header['set-cookie'][0]).promise();
    }).then(function(res) {
      let $ = cheerio.load(res.text);
      let $r = $('.section-detail table').children('tr');

      let title = $($($r[0]).children('td')[0]).text();

      // TODO parse after hackathon... this is gonna take forever.
      let info = $($($r[1]).find('table tbody')[0]);

      // Parse description
      let desc = $($($r[3]).find('td')[0]).html();

      return {
        desc: desc
      };
    });
  },

  search(term, dept) {
    return request.get(SEARCH_BASE + 'term_' + term + '/cp_' + dept).promise().then(function(res) {
      let $ = cheerio.load(res.text);
      let ret = [];
      $('.section-list table tbody tr').each(function() {
        let $r = $(this).children('td');

        // Parse
        let c0 = $($r[0]);
        let term = c0.clone().children().remove().end().text();
        let status = $(c0.children('span')[0]).text();

        let c1 = $($r[1]);
        let idSplit = $(c1.children('a')[0]).attr('href').split('/');
        let id = idSplit[idSplit.length - 1];
        let section = $(c1.children('a')[0]).text();
        let num = c1.clone().children().remove().end().text();

        let title = $($r[2]).text();

        let instructors = [];
        $($r[3]).children('a').each(function() {
          instructors.push($(this).text().trim());
        });

        let c4 = $($r[4]);
        let schedule = c4.clone().children().remove().end().text();
        let loc = $(c4.children('a')[0]).text();

        let fill = $($($r[5]).children('div')[0]).attr('title').split(' ')[0];

        ret.push({
          id: id,
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
