//Represents a full inhouse
class Inhouse 
{
    constructor() 
    {
        this.players = [];
        this.currentMatch = null;
    }

    addPlayerToInhouse(newPLayerDiscordName, newPLayerSummonerName) 
    {
        var newPLayer = new Player(newPLayerDiscordName, newPLayerSummonerName)
        //if the summoner name could not be found, return -1 to let the bot know
        if(newPLayer.summonerID === -1)
        {
            return -1;
        }
        
        //otherwise stick the new player into our list
        players.push(newPLayer);

        //if we've got 10 players, great, start the match
        if(this.players.length === 10 && this.currentMatch === null)
        {
            this.CreateMatch();
            //return 0 to let our bot know to stop accepting joins
            return 0;
        }

        return 1;
    }

    CreateMatch()
    {
        this.currentMatch = new Match(this.players);
    }
    // UpdateMatch()
    // {

    // }
}

//Represents an individual player in the inhouse
//Stores discord username and riot api data
class Player 
{
    //takes a player's discord username, translates to linked summoner id
    constructor(playerDiscordName, playerSummonerName) 
    {
        this.discordName = playerDiscordName;
        this.summonerName = playerSummonerName
        this.summonerID = getSummonerId(this.summonerName);
        //only try to pull more data if we succesfully pulled the ID
        if(this.summonerID !== -1)
        {
            this.rankWeight = calculateRankWeight(this.summonerID);
        }

        //retrieves summoner id from summoner name
        function getSummonerId(name)
        {
            var _summonerId;
            //track response code from server, if nonzero, error was thrown
            var responseCode = 0;
            //PULL/PARSE JSON DATA HERE


            if(responseCode !== 0)
            {
                //can send specific errors here if need be
                return -1;
            }
            else
            {
                return _summonerId;
            }
        }

        //calculates the weight of the player's rank from their id
        function calculateRankWeight(summId) 
        {
            var _rankWeight = 0;

            //pull json data
            var tier;
            var division;

            //calculate weight
            switch(tier)
            {
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
                    console.log("tier: " + tier);
            }
            switch(division)
            {
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
    }
}

//The data representation of one inhouse match, with sorted teams
class Match
{
    //takes a list of player objects
    constructor(players)
    {
        if(players.length != 10)
        {
            //TODO: better error handle
            console.error("need 10 players");
            return;
        }

        this.team1 = [];
        this.team2 = [];

        void function sortTeams()
        {
            //sort in descending order by rank weight
            players.sort(function(a, b) {
                return b.rankWeight - a.rankWeight;
            });

            for(var i = 0; i < players.length; i++)
            {
                //put every other player into the corresponding team
                if(i % 2 == 0)
                {
                    team1.push(players[i]);
                }
                else
                {
                    team2.push(players[i]);
                }
            }
        };
    }

}