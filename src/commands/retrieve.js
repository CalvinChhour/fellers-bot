const Discord = require('discord.js');
const logger = require('./../logger');
const db = require('./../mongo');

module.exports = {
	retrieve : {
		name : 'retrieve',
		args : true,
		description : 'Retrieve a command from the database.',
		async execute(message, data) {
			const mongo = await db;

			const retrieved = await mongo.collection('Store').findOne({_id: data[0].trim()});
			if (!retrieved) {
				message.channel.send('',
					new Discord.RichEmbed({description: 'This command does not exist'}));
			}
			else {
				message.channel.send('',
					new Discord.RichEmbed({description: retrieved.RetrievedData}));
			}
		}
	},
};