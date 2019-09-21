const Discord = require ('discord.js');
const logger = require('./../logger');
const utils = require('./../utils');

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
			message.channel.send('',
				new Discord.RichEmbed(data)
					.setImage(`https://cdn.discordapp.com/emojis/${emojiId + fileType}`)
					.setColor(message.member.displayHexColor))
				.then(res => logger.info(`Emote attached: ${res}`))
				.catch(err => logger.error(`Emote failed to send: ${err}`));
			await message.delete()
				.catch(err => logger.error(`Error deleting the messgae: ${err}`));
		}
	},
};
