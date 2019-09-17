/* eslint-disable no-mixed-spaces-and-tabs */
const Discord = require('discord.js');
const logger = require('./../logger');

module.exports = {
	avatar :{
		name : 'avatar',
		args : false,
		description : 'present the avatar of the person',
		async execute(message, payload) {
			logger.info('avatar command... Module');
			await message.delete()
				.then(() => logger.info('avatar command deleted'))
				.catch(err => logger.error(`Delete message failed to send: ${err}`));
			// Send the user's avatar URL
	    message.channel.send('',
		    new Discord.RichEmbed(payload)
					.setImage(message.author.avatarURL)
					.setColor('#0099ff'))
		    .then(() => logger.info('Avatar sent, module'))
		    .catch(err => logger.error(`Avatar failed to send: ${err}`));
		}
	},
};