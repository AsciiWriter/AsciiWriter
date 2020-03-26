'use strict';

const map = require('map-stream');
const cheerio = require('cheerio');

module.exports = function ({ selector }) {

  return map((file, next) => {
    const $ = cheerio.load(file.contents.toString(), { decodeEntities: false });

    $(selector).each((index, code) => {
      const elem = $(code);
      const language = elem.prop('data-lang');
      const fileContents = elem.html();
      elem.parent().replaceWith( `<pre  class="highlight"><code class="language-${language}">${fileContents}</code></pre>`);
    });

    file.contents = Buffer.from($.html());
    next(null, file)
  });
};
