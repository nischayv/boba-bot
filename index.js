const Botkit = require('botkit')
const os = require('os');

const slackToken = process.env.SLACK_TOKEN;
if(!slackToken) {
  process.exit(1);
}

const controller = Botkit.slackbot({
  debug: true,
});

const bot = controller.spawn({
  token: slackToken
});

bot.startRTM((err, bot, payload) => {

});
