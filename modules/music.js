const Discord = require('discord.js')

require('dotenv').config()

const lsModule = require('@penfoldium/lyrics-search')
const findSong = new lsModule(process.env.GENIUS_API)
const { getLyrics } = require('genius-lyrics-api')

const config = require('../config.json')
const util = require('./utilities.js')

module.exports = {
    filter: async(message, arg2, distube) => {
      if (!distube.getQueue(message)) return message.channel.send({content:'\\🌫 Oui play some sound to set filter ight' })
      if (!arg2) return message.channel.send({content: '🌫 You can set the filter with: `3d | bassboost | echo | karaoke | nightcore | vaporwave | flanger | gate | haas | reverse | surround | mcompand | phaser | tremolo | earwax`\n\nExample: `'+config.prefix+' filter reverse | oi filter 3d echo`\nMention the filter type again to turn that filter off uwu' })

      const filters = message.content.substr(config.prefix.length+8, message.content.length).match(/\w+/gm)
      
      const filter = await distube.setFilter(message, filters)
      message.channel.send({content: '🌫 Filter is now set to `' + (filter || 'off')+'`! Wait me apply..,'})
    },

    find: async(message, arg2) => {
      if (!arg2) return message.channel.send({content: '🔎 Provide some lyrics!! Example: `'+config.prefix+' find how you want me to`'})
      const content = message.content

      findSong.search(content.substr(config.prefix.length + 5, content.length))
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
      .catch(e => message.channel.send({content: '❌ Request error! ' + e}))
    },

    lyrics: async(message, arg2, distube) => {
      let queue = distube.getQueue(message)
      if (!queue) return message.channel.send({content: '🕳 Play a sound so I can get the lyrics aight'})

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
        const lyrics = util.msgSplit(res)
        message.channel.send({content: !lyrics ? '⭕ No lyrics found for the song sob' : lyrics[0]+lyrics[1]})
      }).catch(err => message.channel.send({content: err}))
    },

    play: async (message, arg2, distube) => {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) return message.channel.send({content: 'Enter a voice channel pls!'})
 
        const permissions = voiceChannel.permissionsFor(message.client.user)
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send({content: 'I don\'t have the permission to join or speak in the channel 😭'})
        
        if (!arg2) return message.channel.send({content: 'Play what mf,.,'})

        distube.voices.join(message.member.voice.channel)

        await distube.play(message, message.content.slice(config.prefix.length + 5).trim().split(/ +/g).join(" "))
    },

    pause: async(message, _, distube) => {
        if (!message.member.voice.channel) return message.channel.send({content: '🤏 You have to be listening first alr'})
        if (!distube.getQueue(message)) return message.channel.send({content: '🗑 There are no sound around,.'})
        if (distube.isPaused(message)) return message.channel.send({content: '💢 Queue is already paused! Type `'+config.prefix+' resume` to resume.'})

        await distube.pause(message)
        message.channel.send({content: '⏸ Current queue has been paused. Type `'+config.prefix+' resume` to resume.'})
    },
    
    queue: async (message, _, distube) => {
        let queue = distube.getQueue(message)
        if (!queue) return message.channel.send({content: '🕳 Queue empty..,'})

        let q = ' '
        await queue.songs.map((song, index) => {
            q = q + `**${index+1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\`\n` 
        })
        message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor('#DD6E0F')
            .setTitle('Current Queue')
            .addFields(
              {name: 'Now playing:', value: q},
            ) 
        ]}) 
    },

    repeat: async (message, arg2, distube) => {
        if (!message.member.voice.channel) return message.channel.send({content: '🙄 Join VC to repeat listening.,'})
        if (!distube.getQueue(message)) return message.channel.send({content: '🕳 No song currently,,'})
        
        if (!arg2 || arg2 === 'on') {
            await distube.setRepeatMode(message, 1)
            message.channel.send({content: '🔄 Current song is on repeat ight!'})
        } else if (arg2 === 'off') {
            await distube.setRepeatMode(message, 0)
            message.channel.send({content: '🔄 Repeat mode is now `off`.'})
        } else if (arg2 === 'q' || arg2 === 'queue') {
            await distube.setRepeatMode(message, 2)
            message.channel.send({content: '🔄 Current queue is now on repeat!'})
        }  
    },
    
    remove: async(message, arg2, distube) => {
        let queue = distube.getQueue(message)
        if (!queue) return message.channel.send({content: '🥔 Queue is empty rn so no remove!'})
        if (!arg2) return message.channel.send({content: '🆔 Select a song position to remove from the queue!'})

        const index = parseInt(arg2) - 1
        const toRemove = queue.songs[index].name
        
        await queue.songs.splice(index, 1)
        message.channel.send({content: '💨 **'+toRemove+'** has been removed from queue oki'})
    },

    resume: async(message, _, distube) => {
        if (!message.member.voice.channel) return message.channel.send({content: '🤏 You have to be listening first alr'})
        if (!distube.getQueue(message)) return message.channel.send({content: '🗑 No sound to resume,.'})
        if (!distube.isPaused(message)) return message.channel.send({content: '💢 Queue is playing!!'}).then(m => m.delete({timeout: 5000}))

        await distube.resume(message)
        message.channel.send({content: '⏯ Queue resumed!'}).then(m => setTimeout(() => m.delete, 5000))
    },

    stop: async (message, _, distube) => {
        if (!message.member.voice.channel) return message.channel.send({content: '🤏 Can\'t stop me, u need to be in the channel!'})
        if (!distube.getQueue(message)) return message.channel.send({content: '🗑 There are no songs around,.'})

        await distube.stop(message)
        message.channel.send({content: '😴 All sounds have stopped and queue has been cleared. I\'m out,.,'})
    },

    skip: async (message, _, distube) => {
        if (!message.member.voice.channel) return message.channel.send({content: '🙄 You\'re not listening..,'})
        if (!distube.getQueue(message)) return message.channel.send({content: 'No song to skip,, Play some!!'})
        
        try {
            await distube.skip(message)
            message.channel.send({content: '⏯ **Skipped!**'})
        } catch(_) {
            await distube.stop(message)
            message.channel.send({content: '⏯ There\'s no song left in queue so I\'ll stop, bai!!'})
        }
    },

    volume: async (message, arg2, distube) => {
        if (!message.member.voice.channel) return message.channel.send({content: '🙄 Join VC to change volume!'})
        if (!distube.getQueue(message)) return message.channel.send({content: 'No song around tho,,'})
        
        let level = parseInt(arg2)
        if (!arg2) {
            message.channel.send({content: '⚠ Select a volume level mf!!'})
        } else if (level < 301 && level > -1) {
            await distube.setVolume(message, level)
            message.channel.send({content: '🔢 Oki volume has been set to `'+level+'`'})
        } else {
            message.channel.send({content: '💢 Volume can only be set from `0` to `300`'})
        }
    }
}