let parseEmojiText = (emojiText) => {
    emojiText = emojiText.replace(/<|>/g, '');
    emojiText = emojiText.replace(/:.*:/g, '');
    return emojiText;
}

var utils = module.exports = {parseEmojiText};
