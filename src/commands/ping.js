module.exports = {
	ping : {
		name : 'ping',
		args : false,
		description : 'Ping in /commands',
		execute: (message) => {
			message.channel.send('Pong! :)');
		}
	},
};
