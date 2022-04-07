require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});
client.login(process.env.DISCORDJS_BOT_TOKEN);