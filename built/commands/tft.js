var logger = require('./../logger');
module.exports = {
    tft: {
        name: 'tft',
        args: true,
        description: 'Gives a link to a tracker.gg for TFT',
        execute: function (message, data) {
            message.channel.send(('https://tracker.gg/tft/profile/riot/na/' + data + '/overview'))
                .then(function () { return logger.info('tft returned safely'); })
                .catch(function (err) { return logger.error("Message failed to send: " + err); });
        }
    },
};
