const Discord = require('discord.js');
const logger = require('./../logger');

module.exports = {
	help : {
		name : 'help',
		args : false,
		description : 'Command to call for help from the Discord bot',
		execute: async (message) => {
			try {
				const response = await message.channel.send('',
					new Discord.RichEmbed()
						.setTitle('I\'m the fellers bot - developed by your local\
								\nfellers. Here are some commands you can use.  ')
						.setDescription('`!f emote :KannaWave:` - creates big emote\
										\n `!f m-emote :KannaWave: :KannaDab:` - creates multiple emotes \
										\n`!f avatar` - sends big avatar of user\
										\n`!f whoami` - sends username\
										\n`!f tft Jacob_Hong` - sends tft profile')
						.setThumbnail('https://i.imgur.com/2vtQUck.png')
						.setColor(message.member.displayHexColor)
				);
				if (response) {
					logger.info('Help message relayed');
				}
			} catch (error) {
				logger.error(`Help failed: ${error}`);
			}
		}
	},
};
