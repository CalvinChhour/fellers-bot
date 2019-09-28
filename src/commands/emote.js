const Discord = require ('discord.js');
const logger = require('./../logger');
const {parseEmojiText, sendErrorMessage} = require('../utils/utils');

module.exports = {
	emote : {
		name : 'emote',
		args : true,
		description : 'Sends a bigger version of an emote',
		execute: async(message, data) => {
			logger.info('emote command...');
			let fileType;
			let emoji = data[0];
			if (emoji[0] !== '<' || emoji.slice(-1) !== '>') {
				sendErrorMessage('Enter a valid emoji', message.channel);
			}
			if (emoji[1] === 'a') {
				fileType = '.gif';
				emoji = emoji.replace('a', '');
			} else {
				fileType = '.png';
			}
			const payload = { title: `Sent by ${message.author.username}`};
			const emojiId = parseEmojiText(emoji);
			try {
				let response = await message.channel.send('',
					new Discord.RichEmbed(payload)
						.setImage(`https://cdn.discordapp.com/emojis/${emojiId + fileType}`)
						.setColor(message.member.displayHexColor));
				if (response) {
					logger.info(`Emote attached: ${response}`);
				}
			} catch (error) {
				sendErrorMessage(`Emote failed to send: ${error}`, message.channel);
			}

			try {
				await message.delete();
			} catch (error) {
				logger.error(`Error deleting the message: ${error}`);
			}
		}
	},
	mEmote : {
		name : 'm-emote',
		args : true,
		description : 'Sends a bigger version of an emote',
		execute: async(message, data) => {
			logger.info('multi-emote command...');
			const emojis = data.filter(possibleEmoji => {
				return (possibleEmoji[0] === '<' && possibleEmoji.slice(-1) === '>');
			}).map(emoji => {
				let fileType;
				if (emoji[1] === 'a') {
					fileType = '.gif';
					emoji = emoji.replace('a', '');
				} else {
					fileType = '.png';
				}
				const emojiId = parseEmojiText(emoji);
				return `https://cdn.discordapp.com/emojis/${emojiId + fileType}`;
			}).join(' ');

			try {
				let response = await message.channel.send(emojis);
				if (response) {
					logger.info(`Emote attached: ${response}`);
				}
			} catch (error) {
				sendErrorMessage(`Emote failed to send: ${error}`, message.channel);
			}

			try {
				await message.delete();
			} catch (error) {
				logger.error(`Error deleting the message: ${error}`);
			}
		}
	},
};
