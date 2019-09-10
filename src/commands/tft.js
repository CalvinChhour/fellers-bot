const Discord = require('discord.js');

export = {
    name : 'tft',
    Description : 'Gives a link to a tracker.gg for TFT',
    execute(message,data) {
        message.channel.send(('https://tracker.gg/tft/profile/riot/na'+data'/overview))
        .then(() => logger.info('tft returned safely'))
        .catch((err) => logger.error(`Message failed to send: ${err}`));
        
    }    
}