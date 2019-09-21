const Discord = require ('discord.js');
const logger = require('./../logger');
const utils = require('../utils/utils');

module.exports = {
	emote : {
		name : 'emote',
		args : true,
		description : 'Sends a bigger version of an emote',
		execute: async(message, data) => {
			logger.info('emote command...');
			let fileType;
			if (data[0].charAt(1) === 'a') {
				fileType = '.gif';
				data[0] = data[0].replace('a', '');
			} else {
				fileType = '.png';
			}

			const emojiId = utils.parseEmojiText(data[0]);
			logger.info(`emote id: ${emojiId}`);
			try {
				let message = await message.channel.send('',
					new Discord.RichEmbed(data)
						.setImage(`https://cdn.discordapp.com/emojis/${emojiId + fileType}`)
						.setColor(message.member.displayHexColor));
				if (message) {
					logger.info(`Emote attached: ${message}`);
				}
			} catch (error) {
				logger.error(`Emote failed to send: ${error}`);
			}

			try {
				await message.delete();
			} catch (error) {
				logger.error(`Error deleting the message: ${error}`);
			}
		}
	},
};
