require('dotenv').config({path:'../.env'});

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, VoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

// Create a new client instance
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
]});


// When the client is ready, run this code (only once)
client.on('ready', () => {
	console.log('Ready!');
});

const queue = new Map();

client.on ('messageCreate', (message) => {

	const serverQueue = queue.get(message.guild.id);

	if (message.content === 'join') {
		console.log('join')
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

	if (message.content.startsWith(`play`)) {
		
    execute(message, serverQueue);
    return;
	} else if (message.content.startsWith(`skip`)) {
    skip(message, serverQueue);
    return;	
	} else if (message.content.startsWith(`stop`)) {
    stop(message, serverQueue);
    return;
	}
})

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await joinVoiceChannel({
				channelId: message.member.voice.channel.id,
				guildId: message.member.guild.id,
				adapterCreator: message.channel.guild.voiceAdapterCreator
		});
		
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.login(process.env.DISCORDJS_BOT_TOKEN);