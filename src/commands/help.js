const Discord = require('discord.js');
const logger = require('./../logger');

module.exports = {
	help : {
		name : 'help',
		args : false,
		description : 'Command to call for help from the Discord bot',
		execute: (message) => {
			message.channel.send('',
				new Discord.RichEmbed({description: '!f :KannaWave: - creates big emote \
                                                                          \n !f avatar - sends big avatar of user\
                                                                          \n !f whoami - sends username\
                                                                          \n !f tft Jacob_Hong - sends tft profile ' }))
				.then(() => logger.info('Help message relayed'))
				.catch(err => logger.error(`Help failed: ${err}`));
		}
	},
};