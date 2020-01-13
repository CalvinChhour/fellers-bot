module.exports = {
    ping: {
        name: 'ping',
        args: false,
        description: 'Ping in /commands',
        execute: function (message) {
            message.channel.send('Pong! :)');
        }
    },
};
