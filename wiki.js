const request = require('request')
const cheerio = require('cheerio')

const url = 'https://en.wikipedia.org/wiki/';

function ask(text, cb) {
    const modifiedText = text.replace(' ', '_');
    const mainUrl = `${url}${modifiedText}`
    request(mainUrl, (err, res, html) => {
        if (err) {
            return cb(err, null);
        }

        const $ = cheerio.load(html);
        const basic = $('#mw-content-text').find('p').first().text();

        const response = `${basic} For more information go to ${mainUrl}`;
        return cb(null, response);
    });
}

module.exports.ask = ask;
