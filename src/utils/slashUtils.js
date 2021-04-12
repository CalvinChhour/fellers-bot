const { APIMessage } = require('discord.js');
const logger = require('./../logger');

/*
 * Helper function to handle replying to slash command interactions
 * Might be a better way to do this once discord.js officially supports
 * slash commands. wip pr here (https://github.com/discordjs/discord.js/pull/5106)
 *
 * See official discord documentation: https://discord.com/developers/docs/interactions/slash-commands
 */
const reply = async (interaction, response, client) => {
	let data = {
		content: response,
	};

	if (typeof response === 'object') {
		data = await createAPIMessage(interaction, response, client);
	}

	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data,
		}
	});
};

const createAPIMessage = async (interaction, content, client) => {
	try {
		const { data, files } = await APIMessage.create(
			client.channels.resolve(interaction.channel_id),
			content,
		)
			.resolveData()
			.resolveFiles();
		return {...data, files};
	} catch (e) {
		logger.error(e);
	}
};

module.exports = {reply};