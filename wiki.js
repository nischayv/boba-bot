const request = require('request')
const test = require('./wiki')

const url = 'https://en.wikipedia.org/wiki/';

module.exports = function(text) {
    const modifiedText = text.replace(' ', '_');

    request(url, function(err, response, html) {
        if (!err) {
            const $ = cheerio.load(html);

        }
    });
}
