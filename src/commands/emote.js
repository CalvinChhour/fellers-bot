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
			const payload = { title: `Sent by ${message.author.username}`};	
			const emojiId = utils.parseEmojiText(data[0]);
			logger.info(`emote id: ${emojiId}`);
			try {
				let response = await message.channel.send('',
					new Discord.RichEmbed(payload)
						.setImage(`https://cdn.discordapp.com/emojis/${emojiId + fileType}`)
						.setColor(message.member.displayHexColor));
				if (response) {
					logger.info(`Emote attached: ${response}`);
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
