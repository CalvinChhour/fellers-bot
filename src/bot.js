const Discord = require('discord.js');
const config = require('./config.json');
const utils = require('./utils');
const logger = require('./logger');
const db = require('./mongo');
const inhouse = require('./inhouse');

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
			let modifier = splitMessage[3];
			
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

			if (command === 'inhouse' && data ) {
				//TODO: check that an inhouse is not currently trying to be made, or allow multiple
				//ask calvin about how exactly this works, need to make sure it persists. will not work currently
				let currentInhouse = null;
				switch(data) {
					case 'start':
						//TODO: add modifiers once implemented
						message.channel.send('@here <user> wants to start an inhouse! Type \'!feller inhouse join <*Your League Username*> to join!\'');
						//make a new inhouse object
						currentInhouse = new Inhouse();
						break;
					case 'join':
						if(currentInhouse === null) {
							message.channel.send('Please start an inhouse first!');
						} else if (modifier) {
							let joinReturnCode = currentInhouse.addPlayerToInhouse(message.author.username, modifier);
							if(joinReturnCode === -1) {
								message.channel.send('That username was not recognized, please double check your spelling or any special characters and try again');
							} 
							if(joinReturnCode === 0) {
								message.channel.send('Inhouse is full! Creating teams...');
								if(currentInhouse.currentMatch !== null) {
									message.channel.send('',
										new Discord.RichEmbed({title: 'Lineups:'})
											.addField('Team 1:', currentInhouse.currentMatch.team1.join('\n'), true)
											.addField('Team 2:', currentInhouse.currentMatch.team2.join('\n'), true)
									);
								}
							}
						} else {
							message.channel.send('Please include your League of Legends summoner name like so: !f inhouse join <summoner name>');
						}
						break;
				}
			}
		}
	});

	client.login(config.token);
};

module.exports = {initializeBot};
