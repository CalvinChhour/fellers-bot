const Discord = require('discord.js');
const logger = require('../logger');

module.exports = {
	retrieve : {
		name : 'retrieve',
		args : true,
		description : 'Retrieve a command from the database.',
		execute: async(message, data, mongo) => {
			try {
				const retrieved = await mongo.collection('Store').findOne({_id: data[0].trim()});
				if (!retrieved) {
					message.channel.send('',
						new Discord.MessageEmbed({description: 'This command does not exist'}));
				}
				else {
					message.channel.send('',
						new Discord.MessageEmbed({description: retrieved.RetrievedData}));
				}
			} catch (error) {
				logger.error(error);
			}
		}
	},
};
