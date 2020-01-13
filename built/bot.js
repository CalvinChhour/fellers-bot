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
var Discord = require('discord.js');
var config = require('./config/config');
var logger = require('./logger');
var db = require('./mongo');
var fs = require('fs');
var initializeBot = function () { return __awaiter(_this, void 0, void 0, function () {
    var client, commandFiles, _i, commandFiles_1, file, command, serverInhouses, serverInhouseMessageIDs, mongo;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new Discord.Client({
                    disableEveryone: true,
                    autorun: true
                });
                client.commands = new Discord.Collection();
                commandFiles = fs.readdirSync('./src/commands').filter(function (file) { return file.endsWith('.js'); });
                for (_i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
                    file = commandFiles_1[_i];
                    command = require("./commands/" + file);
                    Object.values(command).map(function (e) { return client.commands.set(e.name, e); });
                }
                serverInhouses = {};
                serverInhouseMessageIDs = {};
                return [4 /*yield*/, db];
            case 1:
                mongo = _a.sent();
                client.on('ready', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        logger.info(client.user.username + " is online!");
                        client.user.setActivity('!f help', { type: 'PLAYING' });
                        return [2 /*return*/];
                    });
                }); });
                client.on('ready', function () {
                    var user = client.user;
                    logger.info("Logged in as " + user.tag + "!");
                    logger.info(user.username + ' - (' + user.id + ')');
                });
                // Create an event listener for messages
                client.on('message', function (message) { return __awaiter(_this, void 0, void 0, function () {
                    var content, splitMessage, command, data;
                    return __generator(this, function (_a) {
                        content = message.content;
                        if (content.substring(0, 7) === '!feller' || content.substring(0, 2) === '!f') {
                            splitMessage = content.split(' ');
                            command = splitMessage[1];
                            data = splitMessage.slice(2);
                            if (!client.commands.has(command)) {
                                logger.debug("Command " + command + " has not been found returning!");
                                return [2 /*return*/];
                            }
                            try {
                                client.commands.get(command).execute(message, data, mongo, serverInhouses, serverInhouseMessageIDs);
                            }
                            catch (error) {
                                logger.error(error);
                            }
                        }
                        return [2 /*return*/];
                    });
                }); });
                client.login(config.token);
                return [2 /*return*/];
        }
    });
}); };
module.exports = { initializeBot: initializeBot };
