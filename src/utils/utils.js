const logger = require('./../logger');

const parseEmojiText = (emojiText) => {
	emojiText = emojiText.replace(/<|>/g, '');
	emojiText = emojiText.replace(/:.*:/g, '');
	return emojiText;
};

const calculateSummonerRankWeight = (tier, division) => {
	let _rankWeight = 0;

	switch (tier) {
	case 'IRON':
		_rankWeight += 0;
		break;
	case 'BRONZE':
		_rankWeight += 10;
		break;
	case 'SILVER':
		_rankWeight += 20;
		break;
	case 'GOLD':
		_rankWeight += 30;
		break;
	case 'PLATINUM':
		_rankWeight += 40;
		break;
	case 'DIAMOND':
		_rankWeight += 50;
		break;
	case 'MASTER':
		_rankWeight += 80;
		break;
	case 'GRANDMASTER':
		_rankWeight += 90;
		break;
	case 'CHALLENGER':
		_rankWeight += 100;
		break;
	default:
		_rankWeight += 20;
	}
	switch (division) {
	case 'I':
		_rankWeight += 8;
		break;
	case 'II':
		_rankWeight += 6;
		break;
	case 'III':
		_rankWeight += 4;
		break;
	case 'IV':
		_rankWeight += 2;
		break;
	default:
		_rankWeight += 0;
		break;
	}
	return _rankWeight;
};

const sendErrorMessage = (message, channel) => {
	channel.send(message);
	logger.error(message);
};

const deleteMessage = async (message) => {
	try {
		let response = await message.delete();
		if (response) {
			logger.info(`Message deleted: ${response}`);
		}
	} catch (error) {
		logger.error(`Error deleting the message: ${error}`);
	}
};

module.exports = {deleteMessage, parseEmojiText, calculateSummonerRankWeight, sendErrorMessage};
