const Discord = require('discord.js');
const logger = require('./../logger');

module.exports = {
	avatar : {
		name : 'avatar',
		args : false,
		description : 'present the avatar of the person',
		execute: async (message, data) => {
			logger.info('avatar command... Module');
			try {
				let messageDeletion = await message.delete();
				if (messageDeletion) {
					logger.info('avatar command deleted');
				}
			} catch (error) {	
				logger.error(`Delete message failed to send: ${error}`);
			}

			try {
				let message = await message.channel.send('',
					new Discord.RichEmbed(data)
						.setImage(message.author.avatarURL)
						.setColor('#0099ff'));
				if (message) {
					logger.info('Avatar sent, module');
				}
			} catch (error) {
				logger.error(`Avatar failed to send: ${error}`);
			}
		}
	},
};
