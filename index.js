const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const slackClient = require('./slackClient');
const routes = require('./routes');
app.use('/', routes);

const slackToken = process.env.SLACK_TOKEN;
const slackLogLevel = 'verbose';
const witToken = process.env.WIT_TOKEN;

rtm.start();


slackClient.addAuthenticatedHandler(rtm, () => {
    app.listen(port);
    console.log(`Kyp is listening on port ${port} in dev mode`);
});

exports = module.exports = app;
