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

controller.hears(['what', 'who'], 'direct_message,direct_mention', (bot, message) => {
    const index = message.text.search('is') + 3;
    const text = message.text.substring(index);
    wiki.ask(text, (err, res) => {
        if (err) {
            return bot.reply(message, 'There has been an error');
        }
        bot.reply(message, res);
    });
});

controller.hears(['shutdown'], 'direct_message,direct_mention', (bot, message) => {

    bot.startConversation(message, (err, convo) => {

        convo.ask('Are you sure you want me to shutdown?', [{
                pattern: bot.utterances.yes,
                callback: (response, convo) => {
                    convo.ask(`What's the passcode??`, [{
                            pattern: 'Davy Jones',
                            callback: (response, convo) => {
                                convo.say('Roger Roger!');
                                convo.next();
                                setTimeout(() => {
                                    bot.closeRTM();
                                }, 3000);
                            }
                        },
                        {
                            pattern: '.*',
                            default: true,
                            callback: (response, convo) => {
                                convo.say('Wrong passcode, Jedi scum');
                                convo.next();
                            }
                        }
                    ]);
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

controller.hears(['uptime', 'identify yourself'],
    'direct_message,direct_mention',
    (bot, message) => {
        const hostname = os.hostname();
        const uptime = timeUtil.formatUptime(process.uptime());

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
    bot.reply(message, 'Hello.');
});

controller.hears(['.*'], 'direct_message,direct_mention', (bot, message) => {
    bot.reply(message, 'Sorry, I did not understand what you just said :(');
});
