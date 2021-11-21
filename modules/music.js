const Discord = require('discord.js')
const Distube = require('distube')

require('dotenv').config()

const lsModule = require('@penfoldium/lyrics-search')
const findSong = new lsModule(process.env.GENIUS_API)
const { getLyrics } = require('genius-lyrics-api')

const config = require('../config.json')
const util = require('./utilities.js')

var distube

module.exports = {
    init: (client) => {
      distube = new Distube.default(client, {emitNewSongOnly: true})

      distube
        .on('finish', queue => queue.textChannel.send('😴 **Queue ended.**').then(m => setTimeout(() => m.delete(),5000)))
        .on('playSong', (queue, song) => queue.textChannel.send('🎶 **'+song.name+'** - ``'+song.formattedDuration+'`` is now playing!').then(m => setTimeout(() => m.delete(), song.duration * 1000)))
        .on('addSong', (queue, song) => queue.textChannel.send(`**${song.name}** - \`${song.formattedDuration}\` has been added to the queue ight`))
        .on("error", (channel, err) => channel.send("❌ Ah shite error: `" + err + "`"));
    },

    filter: async(message, main, arg2) => {
      if (!distube.getQueue(message)) return message.channel.send('\\🌫 Oui play some sound to set filter ight')
      if (!arg2) return message.channel.send('🌫 You can set the filter with: `3d | bassboost | echo | karaoke | nightcore | vaporwave | flanger | gate | haas | reverse | surround | mcompand | phaser | tremolo | earwax`\n\nExample: `'+config.prefix+' filter reverse | oi filter 3d echo`\nMention the filter type again to turn that filter off uwu')

      const filters = main.substr(7, main.length).match(/\w+/gm)
      
      const filter = await distube.setFilter(message, filters)
      return message.channel.send('🌫 Filter is now set to `' + (filter || 'off')+'`! Wait me apply..,')
    },

    find: async(message, main, arg2) => {
      if (!arg2) return message.channel.send('🔎 Provide some lyrics!! Example: `'+config.prefix+' find how you want me to`')

      findSong.search(main.substr(4, main.length))
      .then(res => {
          const info = res.fullTitle.split('by')
          message.channel.send({ embeds: [new Discord.MessageEmbed()
              .setColor('#DD6E0F')
              .setTitle(info[0])
              .setDescription('by'+info[1])
              .setAuthor('Song:')
              .setThumbnail(res.primaryArtist.header)
              .addFields(
                {name: '​', value: '[About song]('+res.url+')\n'+'[About author]('+res.primaryArtist.url+')'}
               )
              .setImage(res.songArtImage)
          ]})
      })
      .catch(e => message.channel.send('❌ Request error! ' + e))
    },

    lyrics: async(message) => {
      let queue = distube.getQueue(message)
      if (!queue) return message.channel.send('🕳 Play a sound so I can get the lyrics aight')

      let data = queue.songs[0].name.split(' - ')
      const songName = (!data[1]? data[0] : data[1]).replace(/\([^)]*\)/gm, '');
      const artist = data[0].replace(/\([^)]*\)/gm, '');

      const options = {
        apiKey: process.env.GENIUS_API,
	      title: songName,
        artist: artist,
        optimizeQuery: true
      }
      
      getLyrics(options).then(res => {
        if (!res) return message.reply('Could not find any lyrics for the sound sorry!')
        const lyrics = util.msgSplit(res)
        lyrics.forEach(async lyricPart => {
          if (!lyricPart || lyricPart.length == 0) return;
          await message.channel.send(lyricPart)
        })
      }).catch(err => message.channel.send(err))
    },

    play: async(message, main, arg2) => {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) return message.channel.send('Enter a voice channel pls!')
 
        const permissions = voiceChannel.permissionsFor(message.client.user)
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send('I don\'t have the permission to join or speak in the channel 😭')
        
        if (!arg2) return message.channel.send('Play what mf,.,')
        
        distube.voices.join(message.member.voice.channel)
        distube.voices.get(message).setSelfDeaf(true)

        await distube.play(message, main.replace(/play /gm, ''))
    },

    pause: async message => {
        const queue = distube.getQueue(message)
        
        if (!message.member.voice.channel) return message.channel.send('🤏 You have to be listening first alr')
        if (!queue) return message.channel.send('🗑 There is no sound around,.')
        if (queue.paused) return message.channel.send('🙄 Queue is already paused!! Type `'+config.prefix+' resume` to resume!')

        await distube.pause(message)
        message.channel.send('⏸ Current queue has been paused. Type `'+config.prefix+' resume` to resume.')
    },
    
    queue: async (message) => {
        let queue = distube.getQueue(message)
        if (!queue) return message.channel.send('🕳 Queue empty..,')

        let q = ' '
        await queue.songs.map((song, index) => {
            q = q + `**${index+1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\`\n` 
        })
        message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor('#DD6E0F')
            .setTitle('Current Queue')
            .setDescription('Total length - `' + queue.formattedDuration+'`')
            .addFields(
              {name: 'Now playing:', value: q},
            ) 
        ]}) 
    },

    repeat: async (message, _, arg2) => {
        if (!message.member.voice.channel) return message.channel.send('🙄 Join VC to repeat listening.,')
        if (!distube.getQueue(message)) return message.channel.send('🕳 No song currently,,')
        
        if (!arg2 || arg2 === 'on') {
            await distube.setRepeatMode(message, 1)
            message.channel.send('🔄 Current song is on repeat ight!')
        } else if (arg2 === 'off') {
            await distube.setRepeatMode(message, 0)
            message.channel.send('🔄 Repeat mode is now `off`.')
        } else if (arg2 === 'q' || arg2 === 'queue') {
            await distube.setRepeatMode(message, 2)
            message.channel.send('🔄 Current queue is now on repeat!')
        }  
    },
    
    remove: async(message, _, arg2) => {
        let queue = distube.getQueue(message)
        if (!queue) return message.channel.send('🥔 Queue is empty rn so no remove!')
        if (!arg2) return message.channel.send('🆔 Select a song position to remove from the queue!')

        const index = parseInt(arg2) - 1
        const toRemove = queue.songs[index].name
        
        await queue.songs.splice(index, 1)
        message.channel.send('💨 **'+toRemove+'** has been removed from queue oki')
    },

    resume: async(message) => {
        let queue = distube.getQueue(message)

        if (!message.member.voice.channel) return message.channel.send('🤏 You have to be listening first alr')
        if (!queue) return message.channel.send('🗑 No sound to resume,.')
        if (!queue.paused) return message.channel.send('🙄 Queue is already playing trl')

        await distube.resume(message)
        message.channel.send('⏯ Queue resumed!').then(m => setTimeout(() => m.delete, 5000))
    },

    stop: async (message) => {
        if (!message.member.voice.channel) return message.channel.send('🤏 Can\'t stop me, u need to be in the channel!')
        if (!distube.getQueue(message)) return message.channel.send('🗑 There are no songs around,.')

        await distube.stop(message)
        message.channel.send('😴 All sounds have stopped and queue has been cleared. I\'m out,.,')
    },

    skip: async (message) => {
        if (!message.member.voice.channel) return message.channel.send('🙄 You\'re not listening..,')
        if (!distube.getQueue(message)) return message.channel.send('No song to skip,, Play some!!')
        
        try {
            await distube.skip(message)
            message.channel.send('⏯ **Skipped!**')
        } catch(_) {
            await distube.stop(message)
            message.channel.send('⏯ There\'s no song left in queue so I\'ll stop, bai!!')
        }
    },

    volume: async (message, _, arg2) => {
        if (!message.member.voice.channel) return message.channel.send('🙄 Join voice channel first pls')
        if (!distube.getQueue(message)) return message.channel.send('No song around tho,,')
        
        const level = parseInt(arg2)
        if (!arg2) {
            message.channel.send('⚠ Select a volume level mf!!')
        } else if (level < 301 && level > -1) {
            await distube.setVolume(message, level)
            message.channel.send('🔢 Oki volume has been set to `'+level+'`')
        } else {
            message.channel.send('💢 Volume can only be set from `0` to `300`')
        }
    }
}