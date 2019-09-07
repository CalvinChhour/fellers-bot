module.exports = {
	name : 'ping',
description : 'Ping in /commands',
	execute(message, _data) {
		message.channel.send('Pong! :)');
	},
};