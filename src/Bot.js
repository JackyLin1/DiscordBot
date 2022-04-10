require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');


// Create a new client instance
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES
]});


// When the client is ready, run this code (only once)
client.on('ready', () => {
	console.log('Ready!');
});

client.on ('messageCreate', (message) => {
	console.log(message.content);
})

client.login(process.env.DISCORDJS_BOT_TOKEN);



	// if (isReady && message.content === 'HI') {
	// 	isReady = false;
	// 	var voiceChannel = message.member.voiceChannel;
	// 	voiceChannel.join()
	// 	// .then(connection => {
	// 	// 	const dispatcher = connection.playFile ('./Audio/gab.mp3');
	// 	// 	dispatcher.on ("end", end => {
	// 	// 		voiceChannel.leave();
	// 	// 	});	
	// 	// })
	// 	// .catch(err => console.log(err));
	// 	// isReady = true;
	// }