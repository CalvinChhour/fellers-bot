const Discord = require('discord.js');
const config = require('./config/config');
const utils = require('./utils');
const logger = require('./logger');
const db = require('./mongo');
const fs = require('fs');
<<<<<<< HEAD
=======


>>>>>>> 98e512a334756c7451ba999340be90a43cd3e69f



let initializeBot = async() => {
	const client = new Discord.Client({
		disableEveryone: true,
		autorun: true
	});

	client.commands = new Discord.Collection();
	const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

	for(const file of commandFiles) {
		const command = require(`./commands/${file}`);

		client.commands.set(command.name, command);
	}

<<<<<<< HEAD
	const mongoi = await db;
=======
	const db = async () => await db;
>>>>>>> 98e512a334756c7451ba999340be90a43cd3e69f

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
			
			if(!client.commands.has(command)) return;

			try {
				client.commands.get(command).execute(message, data);
			}

			catch (error) {
				logger.error(error);
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
				/*
				logger.info('avatar command...');
				await message.delete();
				// Send the user's avatar URL
				message.channel.send('',
					new Discord.RichEmbed(payload)
						.setImage(message.author.avatarURL))
					.then(() => logger.info('Avatar sent'))
					.catch(err => logger.error(`Avatar failed to send: ${err}`));
					*/
			}

			if (command === 'whoami') {
				/*
				logger.info('name command...');
				// Send the user's username and roles
				message.channel.send('',
					new Discord.RichEmbed({title: 'You are: ', description: message.author.username})
						.addField('Roles:', message.member.roles.map(r => `${r}`).join(' | '), true)
						.setColor(message.member.displayHexColor));
                */
				client.commands.get('whoami').execute(message);
			}

			if (command === 'tft' && data) {
				logger.info('tft command...');
				message.channel.send(('https://tracker.gg/tft/profile/riot/NA/'+data+'/overview'));
			}

<<<<<<< HEAD


			if (command === 'store' && data) {
				logger.info('store command...');
				const StoreCommand = splitMessage[2];
				const RetrieveCommand = splitMessage.slice(3).join(' ');
				try {
					const data = await mongo.collection('Store').findOne({_id: StoreCommand});
					if (!data) {
						await mongo.collection('Store').insertOne({_id: StoreCommand, RetrievedData: RetrieveCommand});
						logger.info('Commmand and command data inserted');
					}
					else {
						await mongo.collection('Store').replaceOne({_id: StoreCommand}, {_id: StoreCommand, RetrievedData: RetrieveCommand});
						logger.info('Old commands data replaced with the new commands data.');
					}
				} catch (err) {
					logger.error(err);
				}
			}
			if (command === 'retrieve' && data) {
				const retrieved = await mongo.collection('Store').findOne({_id: data.trim()});
				if (!retrieved) {
					message.channel.send('',
						new Discord.RichEmbed({description: 'This command does not exist'}));
				}
				else {
					message.channel.send('',
						new Discord.RichEmbed({description: retrieved.RetrievedData}));
				}
=======
			if(command === 'ping') {
				client.commands.get('ping').execute(message, data);
>>>>>>> 98e512a334756c7451ba999340be90a43cd3e69f
			}
		}
	});

	client.login(config.token);
};

module.exports = {initializeBot};
