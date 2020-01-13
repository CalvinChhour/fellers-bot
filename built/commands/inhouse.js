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
var https = require('https');
var riotKey = require('./../config/config.json').riotKey;
var urlSummId = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
var urlSummRank = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/';
var urlFinish = '?api_key=' + riotKey;
var logger = require('./../logger');
var Discord = require('discord.js');
var utils = require('../utils/utils');
module.exports = {
    inhouse: {
        name: 'inhouse',
        args: true,
        description: 'Starts up an inhouse for this server',
        execute: function (message, data, mongo, serverInhouses, serverInhouseMessageIDs) { return __awaiter(_this, void 0, void 0, function () {
            var commandType, commandModifier, inhouseType;
            return __generator(this, function (_a) {
                logger.info('inhouse command...');
                commandType = data[0];
                commandModifier = data.slice(1).join(' ');
                try {
                    switch (commandType) {
                        case 'clear':
                            delete serverInhouses[message.guild.name];
                            delete serverInhouseMessageIDs[message.guild.name];
                            message.delete();
                            message.channel.send('Inhouse cleared, feel free to start a new one!');
                            break;
                        case 'start':
                            if (!(message.guild.name in serverInhouses)) {
                                inhouseType = '';
                                if (commandModifier === '4fun') {
                                    inhouseType = '4fun';
                                }
                                else {
                                    inhouseType = 'tryhard';
                                }
                                message.channel.send(message.author.username + ' wants to start a ' + inhouseType + ' inhouse! Type "!f inhouse join <*Your League Username*>" to join!');
                                serverInhouses[message.guild.name] = new Inhouse(inhouseType);
                                logger.info('New ' + inhouseType + ' Inhouse created');
                            }
                            else {
                                message.channel.send('An Inhouse already exists for this server, please use "!f inhouse clear" if you wish to create a new one');
                            }
                            break;
                        case 'join':
                            if (!(message.guild.name in serverInhouses)) {
                                message.channel.send('Please start an inhouse first!');
                            }
                            else if (commandModifier) {
                                serverInhouses[message.guild.name].addPlayerToInhouse(message.author.username, commandModifier).then(function (respone) {
                                    var joinReturnCode = respone;
                                    if (joinReturnCode === -1) {
                                        message.channel.send('That username was not recognized, please double check your spelling or any special characters and try again');
                                    }
                                    if (joinReturnCode === 0) {
                                        message.delete();
                                        message.channel.send('Inhouse is full! Creating teams...');
                                        var team1Names_1 = [];
                                        var team2Names_1 = [];
                                        serverInhouses[message.guild.name].currentMatch.team1.forEach(function (element) {
                                            team1Names_1.push(element.summonerName);
                                        });
                                        serverInhouses[message.guild.name].currentMatch.team2.forEach(function (element) {
                                            team2Names_1.push(element.summonerName);
                                        });
                                        if (serverInhouses[message.guild.name].currentMatch !== null) {
                                            var desc = ((serverInhouses[message.guild.name].type === '4fun') ? 'Sorted randomly' : 'Sorted by Soloqueue Rank');
                                            message.channel.send('', new Discord.RichEmbed({ title: 'Lineups: ', description: desc })
                                                .addField('Team 1:', team1Names_1.join('\n'), true)
                                                .addField('Team 2:', team2Names_1.join('\n')), true);
                                        }
                                        logger.info('Inhouse full for server ' + message.guild.name + ', created teams...');
                                    }
                                    if (joinReturnCode === 1) {
                                        var joinedNames_1 = [];
                                        serverInhouses[message.guild.name].players.forEach(function (element) {
                                            joinedNames_1.push(element.summonerName);
                                        });
                                        if (!(message.guild.name in serverInhouseMessageIDs)) {
                                            message.delete();
                                            message.channel.send('', new Discord.RichEmbed({ title: 'Current Players:' })
                                                .addField(joinedNames_1.join(', '), false)).then(function (respone) {
                                                serverInhouseMessageIDs[message.guild.name] = respone.id;
                                            });
                                        }
                                        else {
                                            message.delete();
                                            message.channel.fetchMessage(serverInhouseMessageIDs[message.guild.name])
                                                .then(function (message) { return message.edit('', new Discord.RichEmbed({ title: 'Current Players:' })
                                                .addField(joinedNames_1.join(', '), false)); });
                                        }
                                    }
                                }).catch(function (err) {
                                    logger.error(err);
                                });
                            }
                            else {
                                message.channel.send('Please include your League of Legends summoner name like so: !f inhouse join <summoner name>');
                            }
                            break;
                    }
                }
                catch (err) {
                    logger.error(err);
                }
                return [2 /*return*/];
            });
        }); }
    }
};
var Inhouse = /** @class */ (function () {
    function Inhouse(_type) {
        this.players = [];
        this.currentMatch = null;
        this.type = _type;
    }
    Inhouse.prototype.addPlayerToInhouse = function (newPLayerDiscordName, newPlayerSummonerName) {
        var _this = this;
        return new Promise(function (resolve) {
            new Player(newPLayerDiscordName, newPlayerSummonerName).then(function (response) {
                var newPlayer = response;
                if (newPlayer.summonerID === -1) {
                    resolve(-1);
                }
                _this.players.push(newPlayer);
                if (_this.players.length === 10 && _this.currentMatch === null) {
                    _this.CreateMatch();
                    resolve(0);
                }
                resolve(1);
            }).catch(function (err) {
                logger.error(err);
            });
        });
    };
    Inhouse.prototype.CreateMatch = function () {
        this.currentMatch = new Match(this.players, this.type);
    };
    return Inhouse;
}());
var Player = /** @class */ (function () {
    function Player(playerDiscordName, playerSummonerName) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.discordName = playerDiscordName;
            _this.summonerName = playerSummonerName;
            _this.summonerID;
            _this.rankWeight;
            _this.getSummonerId(_this.summonerName).then(function (response) {
                _this.summonerID = response;
                if (_this.summonerID !== null) {
                    _this.getRankWeight(_this.summonerID).then(function (response2) {
                        _this.rankWeight = response2;
                        resolve(_this);
                    }).catch(function (err) {
                        logger.error(err);
                    });
                }
            }).catch(function (err) {
                logger.error(err);
            });
        });
    }
    Player.prototype.getSummonerId = function (name) {
        return new Promise(function (resolve, reject) {
            var _summonerId;
            var fullUrl = urlSummId + name + urlFinish;
            https.get(fullUrl, function (resp) {
                var data = '';
                resp.on('data', function (chunk) {
                    data += chunk;
                });
                resp.on('end', function () {
                    try {
                        var jsonResp = JSON.parse(data);
                        _summonerId = jsonResp.id;
                        resolve(_summonerId);
                    }
                    catch (e) {
                        reject(e.message);
                    }
                });
            }).on('error', function (err) {
                reject("Got error: " + err.message);
            });
        });
    };
    Player.prototype.getRankWeight = function (summId) {
        return new Promise(function (resolve, reject) {
            var _rankWeight = 0;
            var tier;
            var division;
            var fullUrl = urlSummRank + summId + urlFinish;
            https.get(fullUrl, function (resp) {
                var data = '';
                resp.on('data', function (chunk) {
                    data += chunk;
                });
                resp.on('end', function () {
                    try {
                        var jsonResp = JSON.parse(data);
                        for (var i = 0; i < jsonResp.length; i++) {
                            if (jsonResp[i] != null && jsonResp[i].queueType === 'RANKED_SOLO_5x5') {
                                tier = jsonResp[i].tier;
                                division = jsonResp[i].rank;
                                break;
                            }
                        }
                        _rankWeight = utils.calculateSummonerRankWeight(tier, division);
                        resolve(_rankWeight);
                    }
                    catch (e) {
                        reject(e.message);
                    }
                });
            }).on('error', function (err) {
                reject("Got error: " + err.message);
            });
        });
    };
    return Player;
}());
var Match = /** @class */ (function () {
    function Match(players, _type) {
        if (players.length != 10) {
            logger.error('Need 10 players');
            return;
        }
        this.team1 = [];
        this.team2 = [];
        this.type = _type;
        this.sortTeams(players);
    }
    Match.prototype.sortTeams = function (players) {
        if (this.type === '4fun') {
            players.sort(function () { return Math.random() - 0.5; });
            this.team1 = players.slice(0, 5);
            this.team2 = players.slice(5, 10);
        }
        else {
            players.sort(function (a, b) {
                return b.rankWeight - a.rankWeight;
            });
            this.team1 = players.filter(function (e) { return e % 2; });
            this.team2 = players.filter(function (e) { return !(e % 2); });
        }
    };
    return Match;
}());
