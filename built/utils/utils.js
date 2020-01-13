var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var logger = require('./../logger');
var parseEmojiText = function (emojiText) {
    emojiText = emojiText.replace(/<|>/g, '');
    emojiText = emojiText.replace(/:.*:/g, '');
    return emojiText;
};
var calculateSummonerRankWeight = function (tier, division) {
    var _rankWeight = 0;
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
var sendErrorMessage = function (message, channel) {
    channel.send(message);
    logger.error(message);
};
var deleteMessage = function (message) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, message.delete()];
            case 1:
                response = _a.sent();
                if (response) {
                    logger.info("Message deleted: " + response);
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                logger.error("Error deleting the message: " + error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
module.exports = { deleteMessage: deleteMessage, parseEmojiText: parseEmojiText, calculateSummonerRankWeight: calculateSummonerRankWeight, sendErrorMessage: sendErrorMessage };
