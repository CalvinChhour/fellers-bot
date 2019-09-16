# fellers-bot

## git
Follow this guide if you are new to Git. https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup

Run `git clone https://github.com/CalvinChhour/fellers-bot/` to get the project

## build locally
Make sure you have [node.js](https://nodejs.org/en/) installed

1) run `npm i`
2) Create config.json in `src/config` folder. Your file should look like this:
```
{
    "token": <insert discord auth token>,
    "db": {
        "uri": <insert mongo uri>,
        "table": "test",
        "options": {
            "useNewUrlParser": true,
            "useUnifiedTopology": true
        }
    }
}

```
Fill in the discord auth token and mongo uri
> you can grab this token from the [Discord Devloper Portal](https://discordapp.com/developers/applications/) dm one of the devs for the discord auth token.
> also dm calvin for mogno uri.

3) run `npm run start` and the bot should be up and running.

## aws
There is currently an aws ec2 instance that hosts and runs the bot. 

Once ssh'd into the ec2 instance, run `npm run pm2` to start up the fellers bot.
