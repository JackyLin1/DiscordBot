require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, VoiceConnection } = require('@discordjs/voice');

// Create a new client instance
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
]});


// When the client is ready, run this code (only once)
client.on('ready', () => {
	console.log('Ready!');
});

client.on ('messageCreate', (message) => {
	if (message.content === 'join') {
		joinVoiceChannel({
			channelId: message.member.voice.channel.id,
			guildId: message.member.guild.id,
			adapterCreator: message.channel.guild.voiceAdapterCreator
	})
	}
	if (message.content === 'leave') {
		console.log("leave")
		joinVoiceChannel({
			channelId: message.member.voice.channel.id,
			guildId: message.member.guild.id,
			adapterCreator: message.channel.guild.voiceAdapterCreator
		}).destroy();
	}
})

client.login(process.env.DISCORDJS_BOT_TOKEN);