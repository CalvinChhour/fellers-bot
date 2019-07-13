const Discord = require('discord.js');
const auth = require('./auth.json');
const utils = require('./utils');
const logger = require('./logger');


let initializeBot = () => {    
    // Initialize Discord Bot
    const client = new Discord.Client({
        disableEveryone: true,
        autorun: true
    });

    client.on("ready", async() => {
        logger.info(`${client.user.username} is online!`)
        client.user.setActivity('!f help', {type: 'PLAYING'});
    })

    client.on('ready', () => {
        const user = client.user;
        logger.info(`Logged in as ${user.tag}!`);
        logger.info(user.username + ' - (' + user.id + ')');
    });

    // Create an event listener for messages
    client.on('message', async (message) => {
        logger.info(`Message sent by [${message.author.username}] in #${message.channel.name}: ${message.content}`)
        const content = message.content;
        const payload = { title: `Sent by ${message.author.username}`}; 
        if (content.substring(0, 7) === '!feller' || content.substring(0,2) === '!f') {
            logger.info('!feller prefix read');
            const splitMessage = content.split(' ');
            const command = splitMessage[1];
            let data = splitMessage[2];
            
            if (command === 'help') {
                message.channel.send('', 
                                     new Discord.RichEmbed({description: "!f emote :KannaWave: - creates big emote \
                                                                          \n !f avatar - sends big avatar of user"}));
            }

            if (command === 'emote' && data) {
                logger.info('emote command...')
                await message.delete()
                let fileType; 
                if (data.charAt(1) === 'a') {
                    fileType = '.gif'
                    data = data.replace('a', '')
                } else {
                    fileType = '.png'
                }
                
                const emojiId = utils.parseEmojiText(data);
                logger.info(`emote id: ${emojiId}`)
                message.channel.send('', 
                                     new Discord.RichEmbed(payload)
                                     .setImage(`https://cdn.discordapp.com/emojis/${emojiId + fileType}`))
                                        .then(res => logger.info(`Emote attached: ${res}`))
                                        .catch(err => logger.error(`Emote failed to send: ${err}`));
            }

            if (command === 'avatar') {
                logger.info('avatar command...')
                await message.delete();
                // Send the user's avatar URL
                message.channel.send('',
                                     new Discord.RichEmbed(payload)
                                     .setImage(message.author.avatarURL));
            }
        }
    });

    client.login(auth.token);
}

var bot = module.exports = {initializeBot};