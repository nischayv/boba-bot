const request = require('request')

const url = 'https://en.wikipedia.org/wiki/';

function ask(text) {
    const modifiedText = text.replace(' ', '_');

    request(url, (err, response, html) => {
        if (!err) {
            const $ = cheerio.load(html);

        }
    });
}

module.exports.ask = ask;
