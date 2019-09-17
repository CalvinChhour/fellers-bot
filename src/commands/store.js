const Discord = require('discord.js');
const logger = require('./../logger');
const db = require('./../mongo');

module.exports = {
	store : {
		name : 'store',
		args : true,
		description : 'Store things for the bot to say again I suppose',
		async execute(message, data) {

			const mongo = await db;
			logger.info('store command...');
			const StoreCommand = data[0];
			const RetrieveCommand = data.slice(1).join(' ');
			try {
				const data = await mongo.collection('Store').findOne({_id: StoreCommand});
				if (!data) {
					await mongo.collection('Store').insertOne({_id: StoreCommand, RetrievedData: RetrieveCommand});
					logger.info('Commmand and command data inserted');
				}
				else {
					await mongo.collection('Store').replaceOne({_id: StoreCommand}, {_id: StoreCommand, RetrievedData: RetrieveCommand});
					logger.info('Old commands data replaced with the new commands data.');
				}
			} catch (err) {
				logger.error(err);
			}
		}
	},
};