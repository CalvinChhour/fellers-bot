const config = require('./config.json');
const logger = require('./logger');
const MongoClient = require('mongodb').MongoClient;

module.exports = (async () => {
	const client = await MongoClient.connect(config.db.uri, config.db.options);
	const db = client.db(config.db.table);
	logger.info(`Database: ${config.db.table} loaded`);
	return db;
})();
