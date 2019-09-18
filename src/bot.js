const Discord = require('discord.js');
const config = require('./config/config');
const logger = require('./logger');
const db = require('./mongo');
const fs = require('fs');



let initializeBot = async() => {
	const client = new Discord.Client({
		disableEveryone: true,
		autorun: true
	});

	client.commands = new Discord.Collection();
	const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		Object.values(command).map(e => client.commands.set(e.name, e));
	}

	const mongo = await db;

	client.on('ready', async () => {
		logger.info(`${client.user.username} is online!`);
		client.user.setActivity('!f help', {type: 'PLAYING'});
	});

	client.on('ready', () => {
		const user = client.user;
		logger.info(`Logged in as ${user.tag}!`);
		logger.info(user.username + ' - (' + user.id + ')');
	});

	var currentInhouse;
	var inhouseMessageID;

	// Create an event listener for messages
	client.on('message', async (message) => {
		const content = message.content;
		if (content.substring(0, 7) === '!feller' || content.substring(0,2) === '!f') {
			const splitMessage = content.split(' ');
			const command = splitMessage[1];
			let data = splitMessage.slice(2);
			if (!client.commands.has(command)) {
				logger.debug(`Command ${command} has not been found returning!`);
				return;
			}
			try {
				client.commands.get(command).execute(message, data, mongo);
			} catch (error) {
				logger.error(error);
			}
		}
	});

	client.login(config.token);
};

module.exports = {initializeBot};
