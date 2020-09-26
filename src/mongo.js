const config = require('./config');
const logger = require('./logger');
const MongoClient = require('mongodb').MongoClient;

module.exports = (async () => {
	try {
		const client = await MongoClient.connect(config.db.uri, config.db.options);
		const db = await client.db(config.db.table);
		logger.info(`Database: ${config.db.table} loaded`);
		return db;
	} catch (error) {
		logger.error(error);
	}
})();
