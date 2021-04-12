const Discord = require('discord.js');
const config = require('./config');
const logger = require('./logger');
const db = require('./mongo');
const fs = require('fs');

let initializeBot = async() => {
	const client = new Discord.Client({
		disableMentions: 'everyone',
		autorun: true
	});

	client.commands = new Discord.Collection();
	const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

	const serverInhouses = {};
	const serverInhouseMessageIDs = {};
	const mongo = await db;

	client.on('ready', async () => {
		logger.info(`${client.user.username} is online!`);
		client.user.setActivity('!f help', {type: 'PLAYING'});
	});

	client.on('ready', async () => {
		const user = client.user;
		logger.info(`Logged in as ${user.tag}!`);
		logger.info(user.username + ' - (' + user.id + ')');

		// Load commands into runtime, ran on ready so we have access to client tokens
		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			Object.values(command).map(e => {
				client.api.applications(client.user.id).commands.post({data: {
					name: e.name,
					description: e.description,
					options: e.options,
				}});
				client.commands.set(e.name, e);
			});
		}
	});
	client.ws.on('INTERACTION_CREATE', async (interaction) => {
		const { name, options } = interaction.data;
		let data = options.map(option => option.value);

		if (!client.commands.has(name)) {
			logger.debug(`Command ${name} has not been found returning!`);
			return;
		}
		try {
			client.commands.get(name).respond(interaction, data, client, mongo, serverInhouses, serverInhouseMessageIDs);
		} catch (error) {
			logger.error(error);
		}
	});

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
				client.commands.get(command).execute(message, data, mongo, serverInhouses, serverInhouseMessageIDs);
			} catch (error) {
				logger.error(error);
			}
		}
	});

	client.login(config.token);
};

module.exports = {initializeBot};
