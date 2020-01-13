const { createLogger, format, transports } = require('winston');
const { combine } = format;

const myCustomLevels = {
	levels: {
		error: 0,
		warn: 1,
		debug: 2,
		info: 3
	},
	colors: {
		error: 'red',
		warn: 'orange',
		debug: 'yellow',
		info: 'green'
	}
};

const customLevelLogger = createLogger({
	levels: myCustomLevels.levels,
	format: combine(
		format.colorize(myCustomLevels.colors),
		format.timestamp({
			format: 'MM-DD-YYYY | HH:mm:ss'
		}),
		format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
	),
	transports: [
		new transports.Console(),
	],
});

module.exports = customLevelLogger;
