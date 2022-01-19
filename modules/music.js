const Discord = require('discord.js')
const Distube = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { getLyrics } = require('genius-lyrics-api')
const { pagination } = require('reconlx')
const lsModule = require('@penfoldium/lyrics-search')
const tts = require('google-tts-api')

const findSong = new lsModule(process.env.GENIUS_API)

const helper = require('../helper')

let distube
let client
let now_playing

function buttons(client, message) {
  client.on('interactionCreate', async interact => {
	if (!interact.isButton()) return
    let queue = distube.getQueue(message)
	  
    if (interact.customId == 'resumeB' && queue.paused) {
      await distube.resume(message)
      message.channel.send('⏯ Queue resumed!')
    } else if (interact.customId == 'pauseB' && !queue.paused) {
      await distube.pause(message)
      message.channel.send('⏸ Queue paused! Click `Resume` to resume k')
    } else if (interact.customId == 'skipB') {
      await distube.skip(message).catch(_ => {
        distube.stop(message)
        return message.channel.send(`⏯ There's no song left in queue so I'll stop, bai!!`)
      })
      message.channel.send('⏯ **Skipped!**')
    }
  })
}

const play = p = async (message, main, arg2) => {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) return message.channel.send('Enter a voice channel pls!')

    const permissions = voiceChannel.permissionsFor(message.client.user)
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send('I don\'t have the permission to join or speak in the channel 😭')
    
    const source = message.attachments[0]? message.attachments[0].attachment : main.replace(/play /gm, '')

    if (!source) return message.channel.send('Play what mf,.,')
    
    distube.voices.join(message.member.voice.channel)
    distube.voices.get(message).setSelfDeaf(true)

    await distube.play(message, source)
    buttons(client, message)
}

const queue = q = async message => {
    let queue = distube.getQueue(message), pages = [], q = ''
    if (!queue) return message.channel.send('🕳 Queue empty..,')

    await queue.songs.map((song, index) => {
        q = q + `**${index+1}**. ${song.name} - \`${song.formattedDuration}\`\n` 
    })
    const queueList = q.match(/(.*?\n){10}/gm) || [q]
    for (list of queueList) {
      pages.push(new Discord.MessageEmbed()
        .setColor('#DD6E0F')
        .setTitle('Current Queue')
        .setDescription('Total length - `'+queue.formattedDuration+'`')
        .addFields({ name: '​', value: list })
      )
    }

    pagination({
      author: message.author,
      channel: message.channel,
      embeds: pages,
      button: [
        {name: 'previous', emoji: '⬅', style: 'DANGER'},
        {name: 'next', emoji: '➡', style: 'PRIMARY'}
      ],
      time: 120000
    })
  }

const repeat = loop = async (message, _, arg2) => {
    const queue = distube.getQueue(message)
    
    if (!message.member.voice.channel) return message.channel.send('🙄 Join VC to repeat listening.,')
    if (!queue) return message.channel.send('🕳 No song currently,,')
    
    if (!arg2 || arg2 == 'on') {
        await distube.setRepeatMode(message, 1)
        message.channel.send('🔁 Current song is on repeat ight!')
    } else if (arg2 == 'off') {
        await distube.setRepeatMode(message, 0)
        message.channel.send('🔁 Repeat mode is now `off`.')
    } else if (arg2 == 'q' || arg2 == 'queue') {
        await distube.setRepeatMode(message, 2)
        message.channel.send('🔁 Current queue is now on repeat!')
    } else if (parseInt(arg2) > 0) {
        for (var i = 1; i <= parseInt(arg2); i++) {
          queue.songs.splice(1, 0, queue.songs[0])
        }
        message.channel.send(`🔁 Current song will repeat for \`${arg2}\` times k`)
    }
}

const remove = rm = async(message, _, arg2) => {
    let queue = distube.getQueue(message)
    if (!queue) return message.channel.send('🥔 Queue is empty rn so no remove!')
    if (!arg2) return message.channel.send('🆔 Select a song position to remove from the queue!')

    const index = parseInt(arg2) - 1
    const toRemove = queue.songs[index].name
    
    await queue.songs.splice(index, 1)
    message.channel.send('💨 **'+toRemove+'** has been removed from queue oki')
}

const skip = s = async message => {
    if (!message.member.voice.channel) return message.channel.send('🙄 You\'re not listening..,')
    if (!distube.getQueue(message)) return message.channel.send('No song to skip,, Play some!!')
    
    await distube.skip(message).catch(_ => {
      distube.stop(message)
      return message.channel.send('⏯ There\'s no song left in queue so I\'ll stop, bai!!')
    })
    message.channel.send('⏯ **Skipped!**')
}

const volume = vol = async (message, _, arg2) => {
    if (!message.member.voice.channel) return message.channel.send('🙄 Join voice channel first pls')
    if (!distube.getQueue(message)) return message.channel.send('No song around tho,,')
    
    const level = parseInt(arg2)
    if (!arg2) {
        message.channel.send('⚠ Select a volume level mf!!')
    } else if (level < 301 && level > -1) {
        await distube.setVolume(message, level)
        message.channel.send(`🔉 Oki volume has been set to \`${level}\``)
    } else {
        message.channel.send('💢 Volume can only be set from `0` to `300`')
    }
}

module.exports = {
    init (cli) {
      distube = new Distube.default(cli, {emitNewSongOnly: true, nsfw: true, 
      plugins: [new SpotifyPlugin()], youtubeDL: false, leaveOnEmpty: false})
      client = cli

      distube
        .on('finish', queue => queue.textChannel.send('😴 **Queue ended.**').then(m => {
          if (now_playing) now_playing.delete();
          setTimeout(() => m.delete(),5000)
        }))
        .on('playSong', (queue, song) => queue.textChannel.send({content: `🎶 **${song.name}** - \`${song.formattedDuration}\` is now playing!`, components: [new Discord.MessageActionRow()
		      .addComponents([
          new Discord.MessageButton().setCustomId('pauseB').setLabel('Pause').setStyle('PRIMARY'),
	        new Discord.MessageButton().setCustomId('resumeB').setLabel('Resume').setStyle('SUCCESS'),
	        new Discord.MessageButton().setCustomId('skipB').setLabel('Skip').setStyle('SECONDARY')
        ])]}).then(async msg => {
          if (now_playing && !now_playing.deleted) {
            await now_playing.delete()
            now_playing = msg
          } else { now_playing = msg }
        }))
        .on('addSong', (queue, song) => {
          if (queue.songs.length > 1) queue.textChannel.send(`➕ **${song.name}** - \`${song.formattedDuration}\` queued - Position ${queue.songs.length}`)
        })
        .on("error", (channel, err) => channel.send(`❌ Ah shite error: \`${err}\``))
    },

    async filter(message, main, arg2) {
      if (!distube.getQueue(message)) return message.channel.send('\\🌫 Oui play some sound to set filter ight')
      if (!arg2) return message.channel.send(`🌫 You can set the filter with: \`3d | bassboost | echo | karaoke | nightcore | vaporwave | flanger | gate | haas | reverse | surround | mcompand | phaser | tremolo | earwax\`\n\nExample: \`${await helper.prefix(message.guild.id)}\` filter reverse | oi filter 3d echo\`\nMention the filter type again to turn that filter off uwu`)

      const filters = main.substr(7, main.length).match(/\w+/gm)
      
      const filter = await distube.setFilter(message, filters)
      return message.channel.send(`🌫 Filter is now set to \`${filter || 'off'}\`! Wait me apply..,`)
    },

    async find(message, main, arg2) {
      if (!arg2) return message.channel.send(`🔎 Provide some lyrics!! Example: \`${await helper.prefix(message.guild.id)} find how you want me to\``)

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
                {name: '​', value: `[About song](${res.url})\n[About author](${res.primaryArtist.url})`}
               )
              .setImage(res.songArtImage)
          ]})
      })
      .catch(e => message.channel.send('❌ Request error! ' + e))
    },

    async jump(message, _, arg2) {
      const voiceChannel = message.member.voice.channel
      if (!voiceChannel) return message.channel.send('Enter a voice channel bu')

      if (!arg2) return message.channel.send('🦘 Jump to where?')

      await distube.jump(message, parseInt(arg2)-1).catch(_ => message.channel.send('The given position does not exist!'))
      message.channel.send('➡ Jumped to position '+arg2+'!')
    },

    async lyrics(message) {
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
        const lyrics = helper.msgSplit(res)
        lyrics.forEach(async lyricPart => {
          if (!lyricPart || lyricPart.length == 0) return;
          await message.channel.send(lyricPart)
        })
      }).catch(err => message.channel.send(err))
    },

    play, p,

    async pause(message) {
        const queue = distube.getQueue(message)
        
        if (!message.member.voice.channel) return message.channel.send('🤏 You have to be listening first alr')
        if (!queue) return message.channel.send('🗑 There is no sound around,.')
        if (queue.paused) return message.channel.send(`🙄 Queue is already paused!! Type \`${await helper.prefix(message.guild.id)} resume\` to resume!`)

        await distube.pause(message)
        message.channel.send(`⏸ Current queue has been paused. Type \`${await helper.prefix(message.guild.id)} resume\` to resume.`)
    },
    
    queue, q,
    repeat, loop,
    remove, rm,

    async replay(message) {
        let queue = distube.getQueue(message)
        if (!message.member.voice.channel) return message.channel.send('🤏 Make sure ur in the channel!')
        if (!queue) return message.channel.send('🔄 Play some sound first!')

        await queue.songs.splice(1, 0, queue.songs[0])
        await  distube.skip(message)
    },

    async resume(message) {
        let queue = distube.getQueue(message)

        if (!message.member.voice.channel) return message.channel.send('🤏 You have to be listening first alr')
        if (!queue) return message.channel.send('🗑 No sound to resume,.')
        if (!queue.paused) return message.channel.send('🙄 Queue is already playing trl')

        await distube.resume(message)
        message.channel.send('⏯ Queue resumed!')
    },

    async stop(message) {
        if (!message.member.voice.channel) return message.channel.send('🤏 Can\'t stop me, u need to be in the channel!')
        if (!distube.getQueue(message)) return message.channel.send('🗑 There are no songs around,.')

        await distube.stop(message)
        message.channel.send('😴 All sounds have stopped and queue has been cleared. I\'m out,.,')
    },

    skip, s,

    async say(message, _, arg2) {
      
    },

    volume, vol
}