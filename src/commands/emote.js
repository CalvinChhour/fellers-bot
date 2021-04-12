const Discord = require ('discord.js');
const logger = require('./../logger');
const {
	deleteMessage,
	parseEmojiText,
	sendErrorMessage
} = require('../utils/utils');
const {
	reply
} = require('../utils/slashUtils');

module.exports = {
	emote : {
		name : 'emote',
		args : true,
		description : 'Sends a bigger version of an emote',
		options: [
			{
				'name': 'emote',
				'description': 'The emote you want to hugify',
				'type': 3,
				'required': true,
			},
		],
		execute: async(message, data) => {
			logger.info('emote command');
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

			deleteMessage(message);
		},
		respond: async (interaction, data, client) => {
			const channel = await client.channels.fetch(interaction.channel_id);
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
				let response = await channel.send(emojis);
				if (response) {
					logger.info(`Emote attached: ${response}`);
				}
				reply(interaction, response, client);
			} catch (error) {
				sendErrorMessage(`Emote failed to send: ${error}`, channel);
			}

			// deleteMessage(message);
		}
	},
};
