let parseEmojiText = (emojiText) => {
	emojiText = emojiText.replace(/<|>/g, '');
	emojiText = emojiText.replace(/:.*:/g, '');
	return emojiText;
};

let calculateSummonerRankWeight = (tier, division) => {
	let _rankWeight = 0;
	//calculate weight
	switch(tier) {
		case "IRON":
			_rankWeight += 0;
			break;
		case "BRONZE":
			_rankWeight += 10;
			break;
		case "SILVER":
			_rankWeight += 20;
			break;
		case "GOLD":
			_rankWeight += 30;
			break;
		case "PLATINUM":
			_rankWeight += 40;
			break;
		case "DIAMOND":
			_rankWeight += 50;
			break;
		case "MASTER":
			_rankWeight += 80;
			break;
		case "GRANDMASTER":
			_rankWeight += 90;
			break;
		case "CHALLENGER":
			_rankWeight += 100;
			break;
		default:
			_rankWeight += 20;
	}
	switch(division) {
		case "I":
			_rankWeight += 8;
			break;
		case "II":
			_rankWeight += 6;
			break;
		case "III":
			_rankWeight += 4;
			break;
		case "IV":
			_rankWeight += 2;
			break;
		default:
			_rankWeight += 0;
			break;
	}
	return _rankWeight;
}
module.exports = {parseEmojiText, calculateSummonerRankWeight};
