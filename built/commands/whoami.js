var Discord = require('discord.js');
module.exports = {
    whoami: {
        name: 'whoami',
        args: false,
        description: 'Send the user\'s username roles',
        execute: function (message) {
            message.channel.send('', new Discord.RichEmbed({ title: 'You are: ', descripton: message.author.username })
                .addField('Roles:', message.member.roles.map(function (r) { return "" + r; }).join(' | '), true)
                .setColor(message.member.displayHexColr));
        }
    },
};
