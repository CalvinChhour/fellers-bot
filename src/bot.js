const Discord = require('discord.js');
const config = require('./config.json');
const utils = require('./utils');
const logger = require('./logger');
const db = require('./mongo');
const Inhouse = require('./inhouse');

let initializeBot = () => {    
	const client = new Discord.Client({
		disableEveryone: true,
		autorun: true
	});

	client.on('ready', async () => {
		logger.info(`${client.user.username} is online!`);
		client.user.setActivity('!f help', {type: 'PLAYING'});
	});

	client.on('ready', () => {
		const user = client.user;
		logger.info(`Logged in as ${user.tag}!`);
		logger.info(user.username + ' - (' + user.id + ')');
	});

	//var currentInhouse;
	var serverInhouses = {};
	var serverInhouseMessageIDs = {};

	// Create an event listener for messages
	client.on('message', async (message) => {
		const content = message.content;
		const payload = { title: `Sent by ${message.author.username}`}; 
		if (content.substring(0, 7) === '!feller' || content.substring(0,2) === '!f') {
			const splitMessage = content.split(' ');
			const command = splitMessage[1];
			let data = splitMessage[2];

			//TODO: make me less gross
			let modifier = '';
			if(splitMessage.length > 3)
			{
				let i = 3;
				for(i; i< splitMessage.length; i++)
				{
					if(i !== splitMessage.length -1) {
					modifier += splitMessage[i] + ' ';
					} else {
						modifier += splitMessage[i];
					}
				}
			}
			
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
				switch(data) {
					case 'clear':
						serverInhouses.remove(message.guild.name);
						break;
					case 'start':
						if(!(message.guild.name in serverInhouses)) {
							let inhouseType = '';
							if(modifier === '4fun') {
								inhouseType = '4fun';
							} else {
								inhouseType = 'tryhard';
							}
							message.channel.send(message.author.username + ' wants to start a ' + inhouseType + ' inhouse! Type \"!f inhouse join <*Your League Username*>\" to join!');
							serverInhouses[message.guild.name] = new Inhouse(inhouseType);
							logger.info('New ' + inhouseType + ' Inhouse created');
						} else {
							message.channel.send('An Inhouse already exists for this server, please use \"!f inhouse clear\" if you wish to create a new one');
						}
						break;
					case 'join':
						if(!(message.guild.name in serverInhouses)) {
							message.channel.send('Please start an inhouse first!');
						} else if (modifier) {
							serverInhouses[message.guild.name].addPlayerToInhouse(message.author.username, modifier).then(respone => {
								let joinReturnCode = respone;
								if(joinReturnCode === -1) {
									message.channel.send('That username was not recognized, please double check your spelling or any special characters and try again');
								} 
								if(joinReturnCode === 0) {
									message.delete();
									message.channel.send('Inhouse is full! Creating teams...');
									team1Names = [];
									team2Names = [];
									serverInhouses[message.guild.name].currentMatch.team1.forEach(element => {
										team1Names.push(element.summonerName);
									});
									serverInhouses[message.guild.name].currentMatch.team2.forEach(element => {
										team2Names.push(element.summonerName);
									});
									if(serverInhouses[message.guild.name].currentMatch !== null) {
										let desc = ((serverInhouses[message.guild.name].type === '4fun')?'Sorted randomly':'Sorted by Soloqueue Rank');
										message.channel.send('',
											new Discord.RichEmbed({title: 'Lineups: ', description: desc})
											.addField('Team 1:', team1Names.join('\n'), true)
											.addField('Team 2:', team2Names.join('\n')), true);
									}
									logger.info('Inhouse full, created teams');
								}
								if(joinReturnCode === 1) {	
									let joinedNames = [];
									serverInhouses[message.guild.name].players.forEach(element => {
										joinedNames.push(element.summonerName);
									});

									if(!(message.guild.name in serverInhouseMessageIDs)) {
										message.delete();
										message.channel.send('',
												new Discord.RichEmbed({title: 'Current Players:'})
													.addField(joinedNames.join(', '), false)
										).then(respone => {
											serverInhouseMessageIDs[message.guild.name] = respone.id;
										});
									} else {
										message.delete();
										message.channel.fetchMessage(serverInhouseMessageIDs[message.guild.name])
										.then(message => message.edit('',
										new Discord.RichEmbed({title: 'Current Players:'})
											.addField(joinedNames.join(', '), false)));
									}
									logger.info('Player joined an inhouse');
								}
							});
						} else {
							message.channel.send('Please include your League of Legends summoner name like so: !f inhouse join <summoner name>');
						}
						break;
				}
			}

			if (command === 'doubt') {
				logger.info('doubt command...');
				await message.delete();
				message.channel.send('', new Discord.RichEmbed(payload)
					.setImage(`https://i.kym-cdn.com/photos/images/original/001/354/591/17c.png`)
					.setColor(message.member.displayHexColor))
				.then(res => logger.info(`Doubt attached: ${res}`))
				.catch(err => logger.error(`Doubt failed to send: ${err}`));
			}
		}
	});

	client.login(config.token);
};

module.exports = {initializeBot};
