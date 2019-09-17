module.exports = {
	ping : {
		name : 'ping',
		args : false,
		description : 'Ping in /commands',
		execute(message, _data) {
			message.channel.send('Pong! :)');
		}
	},
};