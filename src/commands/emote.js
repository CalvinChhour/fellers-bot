
const Discord = require ('discord.js');
const logger = require('./../logger');
const utils = require('./../utils');

module.exports = {
	emote : {
		name : 'emote',
		args : true,
		description : 'Sends a bigger version of an emote',
		async execute(message, data) {
			logger.info('emote command...');
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