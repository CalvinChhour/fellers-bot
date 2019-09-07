const Discord = require ('discord.js');

module.exports = {
	name : 'whoami',
	description : 'Send the user\'s username roles',
	execute(message, data) {
		message.channel.send('',
			new Discord.RichEmbed({title: 'SwishLocal: You are: ', descripton: message.author.username})
				.addField('Roles:', message.member.roles.map(r => `${r}`).join(' | '), true)
				.setColor(message.member.displayHexColr));
	},
};