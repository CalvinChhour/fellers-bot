const Discord = require('discord.js');
const logger = require('./../logger');

module.exports = {
	store : {
		name : 'movienight',
		args : true,
		description : 'add/vote/select the movie for movie nights',
		execute: async (message, data, mongo) => {

			logger.info('movie night command...');
			const movieCommand = data[0];
			const movie = data.slice(1).join(' ');
			try {
				const movieEntry = await mongo.collection('Movie').findOne({_id: 'movienight'});
				switch (movieCommand) {
				case undefined:
					logger.info('undefined command');
					await message.channel.send('',
						new Discord.RichEmbed()
							.setTitle('Use following commands to choose your movie!')
							.setDescription('`!f movienight list`              - Display current watchlist\
                                            \n`!f movienight add <movie1>`      - add a new movie,\
                                            \n `!f movienight vote <movie>`    - vote for a movie; NOT WORKIN YET \
                                            \n `!f movienight unvote <movie>`  - unvote for a movie; NOT WORKIN YET \
                                            \n`!f movienight currentpick`     - sends the movie with the most vote; NOT WORKIN YET \
                                            \n`!f movienight clear`            - clear everything for the current watchlist USE WITH CAUTIONN'));
					break;
				case 'list':
					if (!movieEntry) {
						message.channel.send('',
							new Discord.RichEmbed({description: 'There is currently no watchlist'}));
					} else {
						let movieList = movieEntry.movieList;
						let exampleEmbed = new Discord.RichEmbed({title: 'Watch List', 
							description: 'Here are some feller proposed movie'}).setColor(0xfedc56);
						for (let key in movieList) {
							exampleEmbed = exampleEmbed.addField(key, movieList[key].join('\n'), true);
						}

						message.channel.send('', exampleEmbed);
					}
					break;
				case 'add':
					if (movie === '') {
						message.channel.send('',
							new Discord.RichEmbed({description: 'please specify the movie you wanna add'}));
					} else if (movieEntry) {
						let newMovieQuery = {};
						newMovieQuery['movieList.'+movie] = [message.author.username];

						let movieNameQuery = {};
						movieNameQuery['movieList.'+movie] = { $exists: true };

						let proposerNameQuery = {};
						proposerNameQuery['movieList.'+movie] = [message.author.username];
						const existingMovie = await mongo.collection('Movie').findOne(movieNameQuery);

						if (!existingMovie) {
							mongo.collection('Movie').updateOne({_id: 'movienight'},
								{'$set': newMovieQuery});
							message.channel.send('',
								new Discord.RichEmbed({description: movie+' is added successfully'}));
							logger.info('movie info updated');
						} else {
							mongo.collection('Movie').updateOne({_id: 'movienight'},
								{'$addToSet': proposerNameQuery});
							logger.info('movie already existed');
						}
					} else {
						let newEntry = {};
						newEntry[movie] = [];
						await mongo.collection('Movie').insertOne({_id: 'movienight', movieList: newEntry});
						message.channel.send('',
							new Discord.RichEmbed({description: movie+' is added successfully'}));
						logger.info('movie info created and inserted');
					}
					break;
				case 'clear':
					if (!movieEntry) {
						message.channel.send('',
							new Discord.RichEmbed({description: 'There is currently no watchlist to be cleared'}));
					} else {
						await mongo.collection('Movie').deleteOne({_id: 'movienight'});
						new Discord.RichEmbed({description: 'Movie list has been clear'});
					}
					break;
				}   
			} catch (err) {
				logger.error(err); 
			}
		}
	},
};