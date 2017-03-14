const Botkit = require('botkit')
const os = require('os')
const apiai = require('apiai')
const wiki = require('./wiki')
const timeUtil = require('./utils/timeUtil')

const slackToken = process.env.SLACK_TOKEN;
const apiaiToken = process.env.APIAI_TOKEN;
if (!slackToken || !apiaiToken) {
    process.exit(1);
}
const ai = apiai(apiaiToken);

const controller = Botkit.slackbot({
    debug: true,
    stats_optout: true
});

const bot = controller.spawn({
    token: slackToken
}).startRTM((err) => {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});

controller.hears(['shutdown'], 'direct_message,direct_mention', (bot, message) => {
    bot.startTyping();
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
                    convo.next();
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

controller.hears(['uptime', 'identify yourself', 'who are you.*', 'what are you.*'],
    'direct_message,direct_mention',
    (bot, message) => {
        bot.startTyping();
        const hostname = os.hostname();
        const uptime = timeUtil.formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
            '>. I have been running for ' + uptime + ' on ' + hostname + '.');
    });

controller.hears(['.*'], 'direct_message,direct_mention', (bot, message) => {
    bot.startTyping();
    const request = ai.textRequest(message.text, {
        sessionId: 'e1c8a397-4d65-4e87-977f-00f1f505169e'
    });

    request.on('response', (response) => {
        bot.botkit.log(JSON.stringify(response));
        const { result: { action, fulfillment, parameters } } = response;
        if (action === 'wiki') {
            wiki.ask(parameters.any, (err, res) => {
                if (err) {
                    return bot.reply(message, `I'm really sorry, I couldn't find a good answer!`);
                }
                bot.reply(message, res);
            })
        } else {
            bot.reply(message, fulfillment.speech);
        }
    });

    request.on('error', (error) => {
        bot.botkit.log(error);
    });

    request.end();
});
