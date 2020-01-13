var _a = require('winston'), createLogger = _a.createLogger, format = _a.format, transports = _a.transports;
var combine = format.combine;
var myCustomLevels = {
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
var customLevelLogger = createLogger({
    levels: myCustomLevels.levels,
    format: combine(format.colorize(myCustomLevels.colors), format.timestamp({
        format: 'MM-DD-YYYY | HH:mm:ss'
    }), format.printf(function (info) { return info.timestamp + " - " + info.level + ": " + info.message; })),
    transports: [
        new transports.Console(),
    ],
});
module.exports = customLevelLogger;
