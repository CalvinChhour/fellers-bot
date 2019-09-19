const logger = require('./../logger');

module.exports = {
	store : {
		name : 'store',
		args : true,
		description : 'Store things for the bot to say again I suppose',
		execute: async (message, data, mongo) => {

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
