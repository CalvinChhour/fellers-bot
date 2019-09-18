const https = require('https');
const config = require('./config.json');
const riotKey = config.riotKey;
const urlSummId = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
const urlSummRank = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/";
const urlFinish = '?api_key='+ riotKey;

//Represents a full inhouse
module.exports = class Inhouse {
    constructor(_type) {
        this.players = [];
        this.currentMatch = null;
        this.type = _type;
    }

    addPlayerToInhouse(newPLayerDiscordName, newPlayerSummonerName) {
        return new Promise((resolve, reject) =>{
            new Player(newPLayerDiscordName, newPlayerSummonerName).then(response => {
                var newPlayer = response;
                 //if the summoner name could not be found, return -1 to let the bot know
                if(newPlayer.summonerID === -1) {
                    resolve(-1);
                }
                
                //otherwise stick the new player into our list
                this.players.push(newPlayer);
    
                //if we've got 10 players, great, start the match
                if(this.players.length === 10 && this.currentMatch === null) {
                    this.CreateMatch();
                    //return 0 to let our bot know to stop accepting joins
                    resolve(0);
                }
    
                resolve(1);
            });
        });   
    }

    CreateMatch() {
        this.currentMatch = new Match(this.players, this.type);
    }
    // UpdateMatch()
    // {

    // }
}

//Represents an individual player in the inhouse
//Stores discord username and riot api data
class Player {
    //takes a player's discord username, translates to linked summoner id
    constructor(playerDiscordName, playerSummonerName) {
        return new Promise((resolve, reject) => {
            this.discordName = playerDiscordName;
            this.summonerName = playerSummonerName;
            this.summonerID;
            this.rankWeight;
    
            this.getSummonerId(this.summonerName).then(response => {
                this.summonerID = response;
                //only try to pull more data if we succesfully pulled the ID
                if(this.summonerID !== null) {
                    this.getRankWeight(this.summonerID).then(response => {
                        this.rankWeight = response;
                        resolve(this);
                    });
                }
            });
        });

    }

    //retrieves summoner id from summoner name
    getSummonerId(name) {
        return new Promise((resolve, reject) => {
            var _summonerId;
            let fullUrl = urlSummId + name + urlFinish;
        
            //pull data
            https.get(fullUrl, (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                    });
                // The whole response has been received
                resp.on('end', () => {
                    try {
                        var jsonResp = JSON.parse(data);
                        _summonerId = jsonResp.id;
                        resolve(_summonerId);
                    } catch(e) {
                        reject(e.message);
                    }

                    });
            }).on("error", (err) => {
                reject(`Got error: ${err.message}`);
            });
        });
    }
    
    //returns a summoner's solo queue rank weight
    getRankWeight(summId) {
        return new Promise((resolve, reject) => {
            var _rankWeight = 0;
            var tier;
            var division;
    
            let fullUrl = urlSummRank + summId + urlFinish;
            //pull json data
            https.get(fullUrl, (resp) => {
                let data = '';
    
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                  });
                // The whole response has been received
                resp.on('end', () => {
                    try {
                        var jsonResp = JSON.parse(data)
                        var i;
                        for(i = 0; i < 3; i++) {
                            if(jsonResp[i] != null) {
                                if(jsonResp[i].queueType === 'RANKED_SOLO_5x5') {
                                    tier = jsonResp[i].tier;
                                    division = jsonResp[i].rank;
                                    break;
                                }
                            }
                        }

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
                        resolve(_rankWeight);
                    } catch(e) {
                        reject(e.message);
                    }
                  });
            }).on("error", (err) => {
                reject(`Got error: ${err.message}`);
            });
        });
       
    }
}

//The data representation of one inhouse match, with sorted teams
class Match {
    //takes a list of player objects
    constructor(players, _type) {
        if(players.length != 10) {
            console.error("need 10 players");
            return;
        }

        this.team1 = [];
        this.team2 = [];
        this.type = _type;

        this.sortTeams(players);
    }

    sortTeams(players) {
        ///TODO: Maybe can make this cleaner?
        if(this.type === '4fun') {
            players.forEach(element => {
                let teamAssignment = Math.random(1, 3);
                if(teamAssignment === 1) {
                    if(this.team1.length < 5) {
                        this.team1.push(element);
                    } else {
                        this.team2.push(element);
                    }
                } else {
                    if(this.team2.length < 5) {
                        this.team2.push(element);
                    } else {
                        this.team1.push(element);
                    }
                }
            });
        } else {
            //sort in descending order by rank weight
            players.sort(function(a, b) {
                return b.rankWeight - a.rankWeight;
            });

            for(var i = 0; i < players.length; i++) {
                //put every other player into the corresponding team
                if(i % 2 == 0) {
                    this.team1.push(players[i]);
                }
                else {
                    this.team2.push(players[i]);
                }
            }
        }
    }
}