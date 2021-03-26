const Discord = require ('discord.js');

module.exports = {
	whoami : {
		name : 'whoami',
		args : false,
		description : 'Send the user\'s username roles',
		execute: (message) => {
			message.channel.send('',
				new Discord.MessageEmbed({title: 'You are: ', descripton: message.author.username})
					.addField('Roles:', message.member.roles.map(r => `${r}`).join(' | '), true)
					.setColor(message.member.displayHexColr));
		}
	},
};
