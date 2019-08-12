let parseEmojiText = (emojiText) => {
	emojiText = emojiText.replace(/<|>/g, '');
	emojiText = emojiText.replace(/:.*:/g, '');
	return emojiText;
};

module.exports = {parseEmojiText};
