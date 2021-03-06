const https = require('https');
const riotKey = require('../config.json').riotKey;
const urlSummId = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
const urlSummRank = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/';
const urlFinish = '?api_key='+ riotKey;
const logger = require('./../logger');
const Discord = require ('discord.js');
const utils = require('../utils/utils');

module.exports = {
	inhouse : {
		name : 'inhouse',
		args : true,
		description : 'Starts up an inhouse for this server',
		execute : async(message, data, mongo, serverInhouses, serverInhouseMessageIDs) => {
			logger.info('inhouse command...');
			const commandType = data[0];
			const commandModifier = data.slice(1).join(' ');
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
						let inhouseType = '';
						if (commandModifier === '4fun') {
							inhouseType = '4fun';
						} else {
							inhouseType = 'tryhard';
						}
						message.channel.send(message.author.username + ' wants to start a ' + inhouseType + ' inhouse! Type "!f inhouse join <*Your League Username*>" to join!');
						serverInhouses[message.guild.name] = new Inhouse(inhouseType);
						logger.info('New ' + inhouseType + ' Inhouse created');
					} else {
						message.channel.send('An Inhouse already exists for this server, please use "!f inhouse clear" if you wish to create a new one');
					}
					break;
				case 'join':
					if (!(message.guild.name in serverInhouses)) {
						message.channel.send('Please start an inhouse first!');
					} else if (commandModifier) {
						serverInhouses[message.guild.name].addPlayerToInhouse(message.author.username, commandModifier).then(respone => {
							let joinReturnCode = respone;
							if (joinReturnCode === -1) {
								message.channel.send('That username was not recognized, please double check your spelling or any special characters and try again');
							} 
							if (joinReturnCode === 0) {
								message.delete();
								message.channel.send('Inhouse is full! Creating teams...');
								let team1Names = [];
								let team2Names = [];
								serverInhouses[message.guild.name].currentMatch.team1.forEach(element => {
									team1Names.push(element.summonerName);
								});
								serverInhouses[message.guild.name].currentMatch.team2.forEach(element => {
									team2Names.push(element.summonerName);
								});
								if (serverInhouses[message.guild.name].currentMatch !== null) {
									let desc = ((serverInhouses[message.guild.name].type === '4fun')?'Sorted randomly':'Sorted by Soloqueue Rank');
									message.channel.send('',
										new Discord.MessageEmbed({title: 'Lineups: ', description: desc})
											.addField('Team 1:', team1Names.join('\n'), true)
											.addField('Team 2:', team2Names.join('\n')), true);
								}
								logger.info('Inhouse full for server ' + message.guild.name + ', created teams...');
							}
							if (joinReturnCode === 1) {	
								let joinedNames = [];
								serverInhouses[message.guild.name].players.forEach(element => {
									joinedNames.push(element.summonerName);
								});

								if (!(message.guild.name in serverInhouseMessageIDs)) {
									message.delete();
									message.channel.send('',
										new Discord.MessageEmbed({title: 'Current Players:'})
											.addField(joinedNames.join(', '), false)
									).then(respone => {
										serverInhouseMessageIDs[message.guild.name] = respone.id;
									});
								} else {
									message.delete();
									message.channel.fetchMessage(serverInhouseMessageIDs[message.guild.name])
										.then(message => message.edit('',
											new Discord.MessageEmbed({title: 'Current Players:'})
												.addField(joinedNames.join(', '), false)));
								}
							}
						}).catch(err => {
							logger.error(err);
						});
					} else {
						message.channel.send('Please include your League of Legends summoner name like so: !f inhouse join <summoner name>');
					}
					break;
				} 
			} catch (err) {
				logger.error(err);
			}
		}
	} };

class Inhouse {
	constructor(_type) {
		this.players = [];
		this.currentMatch = null;
		this.type = _type;
	}

	addPlayerToInhouse(newPLayerDiscordName, newPlayerSummonerName) {
		return new Promise((resolve) =>{
			new Player(newPLayerDiscordName, newPlayerSummonerName).then(response => {
				let newPlayer = response;
				if (newPlayer.summonerID === -1) {
					resolve(-1);
				}             
				this.players.push(newPlayer);
				if (this.players.length === 10 && this.currentMatch === null) {
					this.CreateMatch();
					resolve(0);
				}
    
				resolve(1);
			}).catch(err => {
				logger.error(err);
			});
		});   
	}

	CreateMatch() {
		this.currentMatch = new Match(this.players, this.type);
	}
}

class Player {
	constructor(playerDiscordName, playerSummonerName) {
		return new Promise((resolve) => {
			this.discordName = playerDiscordName;
			this.summonerName = playerSummonerName;
			this.summonerID;
			this.rankWeight;
    
			this.getSummonerId(this.summonerName).then(response => {
				this.summonerID = response;
				if (this.summonerID !== null) {
					this.getRankWeight(this.summonerID).then(response2 => {
						this.rankWeight = response2;
						resolve(this);
					}).catch(err => {
						logger.error(err);
					});
				}
			}).catch(err => {
				logger.error(err);
			});
		});

	}

	getSummonerId(name) {
		return new Promise((resolve, reject) => {
			let _summonerId;
			let fullUrl = urlSummId + name + urlFinish;
        
			https.get(fullUrl, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});
				resp.on('end', () => {
					try {
						let jsonResp = JSON.parse(data);
						_summonerId = jsonResp.id;
						resolve(_summonerId);
					} catch (e) {
						reject(e.message);
					}
				});
			}).on('error', (err) => {
				reject(`Got error: ${err.message}`);
			});
		});
	}
    
	getRankWeight(summId) {
		return new Promise((resolve, reject) => {
			let _rankWeight = 0;
			let tier;
			let division;
    
			let fullUrl = urlSummRank + summId + urlFinish;
			https.get(fullUrl, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});
				resp.on('end', () => {
					try {
						let jsonResp = JSON.parse(data);
						for (let i = 0; i < jsonResp.length; i++) {
							if (jsonResp[i] != null && jsonResp[i].queueType === 'RANKED_SOLO_5x5') {
								tier = jsonResp[i].tier;
								division = jsonResp[i].rank;
								break;
							}
						}
						_rankWeight = utils.calculateSummonerRankWeight(tier, division);
						resolve(_rankWeight);
					} catch (e) {
						reject(e.message);
					}
				});
			}).on('error', (err) => {
				reject(`Got error: ${err.message}`);
			});
		});
       
	}
}

class Match {
	constructor(players, _type) {
		if (players.length != 10) {
			logger.error('Need 10 players');
			return;
		}

		this.team1 = [];
		this.team2 = [];
		this.type = _type;

		this.sortTeams(players);
	}

	sortTeams(players) {
		if (this.type === '4fun') {
			players.sort(() => Math.random() - 0.5);
			this.team1 = players.slice(0, 5);
			this.team2 = players.slice(5, 10);
		} else {
			players.sort((a, b) => {
				return b.rankWeight - a.rankWeight;
			});
            
			this.team1 = players.filter(e => e % 2);
			this.team2 = players.filter(e => !(e % 2));
		}
	}
}
