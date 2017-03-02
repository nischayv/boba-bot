const Botkit = require('botkit')
const os = require('os');
const wiki = require('./wiki')
const timeUtil = require('./utils/timeUtil');

const slackToken = process.env.SLACK_TOKEN;
if (!slackToken) {
    process.exit(1);
}

const controller = Botkit.slackbot({
    debug: true
});

const bot = controller.spawn({
    token: slackToken
}).startRTM((err) => {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});

controller.hears(['shutdown'], 'direct_message,direct_mention', (bot, message) => {

    bot.startConversation(message, (err, convo) => {

        convo.ask('Are you sure you want me to shutdown?', [{
                pattern: bot.utterances.yes,
                callback: (response, convo) => {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(() => {
                        bot.closeRTM();
                    }, 3000);
                }
            },
            {
                pattern: bot.utterances.no,
                default: true,
                callback: (response, convo) => {
                    convo.say('*Phew!*');
                    convo.next();
                }
            }
        ]);
    });
});

controller.hears(['start'], 'direct_message,direct_mention', (bot, message) => {
    bot.startRTM((err) => {
        if (err) {
            throw new Error('Could not connect to Slack');
        }
    });
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention',
    (bot, message) => {
        var hostname = os.hostname();
        var uptime = timeUtil.formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
            '>. I have been running for ' + uptime + ' on ' + hostname + '.');
    });

controller.hears(['hello', 'hi', 'hey', 'yo'], 'direct_message,direct_mention', (bot, message) => {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, (err, res) => {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

    controller.storage.users.get(message.user, (err, user) => {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

controller.hears(['what.*', 'who.*'], 'direct_message,direct_mention', (bot, message) => {
    const response = wiki.ask(text);
    bot.reply(response);
});
