module.exports = {
	retrieve : {
		name : 'spam',
		args : true,
		description : 'Spammer.',
		execute: async(message, data) => {
			const sleep = (ms) => {
				return new Promise(resolve => setTimeout(resolve, ms));
			};
			const spam = async () => {
				for (let i = 0; i < 9; i++) {
					message.channel.send(Math.random() * 100000);
					await sleep(1000 + 800 * Math.random());
				}
			}
			const spamMore = async () => {
				for (let j = 0; j < data[0]; j++) {
					spam();
					await sleep(5000 * Math.random());
				}
			};
			spamMore();
		}
	}
};
