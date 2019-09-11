const Discord = require('discord.js');
const config = require('./config/config');
const utils = require('./utils');
const logger = require('./logger');
const db = require('./mongo');

let initializeBot = () => {    
	const client = new Discord.Client({
		disableEveryone: true,
		autorun: true
	});
	const db = async () => await db;

	client.on('ready', async () => {
		logger.info(`${client.user.username} is online!`);
		client.user.setActivity('!f help', {type: 'PLAYING'});
	});

	client.on('ready', () => {
		const user = client.user;
		logger.info(`Logged in as ${user.tag}!`);
		logger.info(user.username + ' - (' + user.id + ')');
	});

	// Create an event listener for messages
	client.on('message', async (message) => {
		const content = message.content;
		const payload = { title: `Sent by ${message.author.username}`}; 
		if (content.substring(0, 7) === '!feller' || content.substring(0,2) === '!f') {
			const splitMessage = content.split(' ');
			const command = splitMessage[1];
			let data = splitMessage[2];
            
			if (command === 'help') {
				message.channel.send('', 
					new Discord.RichEmbed({description: '!f :KannaWave: - creates big emote \
                                                                          \n !f avatar - sends big avatar of user\
                                                                          \n !f whoami - sends username\
                                                                          \n !f tft Jacob_Hong - sends tft profile ' }))
					.then(() => logger.info('Help message relayed'))
					.catch(err => logger.error(`Help failed: ${err}`));
			}

			if (command === 'emote' && data) {
				logger.info('emote command...');
				await message.delete();
				let fileType; 
				if (data.charAt(1) === 'a') {
					fileType = '.gif';
					data = data.replace('a', '');
				} else {
					fileType = '.png';
				}
                
				const emojiId = utils.parseEmojiText(data);
				logger.info(`emote id: ${emojiId}`);
				message.channel.send('', 
					new Discord.RichEmbed(payload)
						.setImage(`https://cdn.discordapp.com/emojis/${emojiId + fileType}`)
						.setColor(message.member.displayHexColor))
					.then(res => logger.info(`Emote attached: ${res}`))
					.catch(err => logger.error(`Emote failed to send: ${err}`));
			}

			if (command === 'avatar') {
				logger.info('avatar command...');
				await message.delete();
				// Send the user's avatar URL
				message.channel.send('',
					new Discord.RichEmbed(payload)
						.setImage(message.author.avatarURL))
					.then(() => logger.info('Avatar sent'))
					.catch(err => logger.error(`Avatar failed to send: ${err}`));
			}

			if (command === 'whoami') {
				logger.info('name command...');
				// Send the user's username and roles
				message.channel.send('',
					new Discord.RichEmbed({title: 'You are: ', description: message.author.username})
						.addField('Roles:', message.member.roles.map(r => `${r}`).join(' | '), true)
						.setColor(message.member.displayHexColor));

			}

			if (command === 'tft' && data) {
				logger.info('tft command...');
				message.channel.send(('https://tracker.gg/tft/profile/riot/NA/'+data+'/overview'));
			}
		}
	});

	client.login(config.token);
};

module.exports = {initializeBot};
