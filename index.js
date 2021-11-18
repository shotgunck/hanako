const Discord = require('discord.js')
const Distube = require('distube')

const mongoose = require('mongoose')

const fs = require('fs')
require('dotenv').config()

const token = process.env.BOT_TOKEN

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]}, {partials: ["MESSAGE", "CHANNEL", "REACTION"] })
const distube = new Distube.default(client, { emitNewSongOnly: true})

const {loadImages} = require('./chess/images')
const chessState = require('./chess/chessBoard')
const chessCommands = require('./chess/commands')

let config = require('./config.json')

client.once('ready', () => {
  console.log('im on')
  client.user.setActivity(config.prefix+' help', { type: 'LISTENING' })
})

client.on('messageCreate', async message => {
  if (message.author.bot) return
  
  const prefix = config.prefix
  const content = message.content
  const subcontents = content.split(' ')
  const prefixed = content.substr(0, prefix.length).toLowerCase()

  const cmd = content.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase()
  const arg2 = cmd === subcontents[1] ? subcontents[2] : subcontents[1]

  if (prefixed === 'c!') {
    const command = chessCommands[cmd] || chessCommands.move
    if (command) {
      command(message, subcontents)
    }
  } else if (prefixed === prefix) {
    fs.readdir('./modules', function (err, files) {
      if (err) return console.log(err)
        
      files.forEach(function (file, _) {
        const command = require('./modules/'+file)[cmd]
        if (command) command(message, arg2, distube)
      })
    }) 
  }
})

distube
  .on('finish', queue => queue.textChannel.send({content: '😴 **Queue ended.**'}).then(m => m.delete({timeout: 5000})))
  .on('playSong', (queue, song) => queue.textChannel.send({content: '🎶 **'+song.name+'** - ``'+song.formattedDuration+'`` is now playing!'}).then(m => setTimeout(() => message.delete(), song.duration * 1000)))
  .on('addSong', (queue, song) => {
    queue.songs.map((_, id) => {
      if (id != 0) queue.textChannel.send({content: `**${song.name}** - \`${song.formattedDuration}\` has been added to the queue ight`})
    })
  })
  .on("error", (channel, err) => channel.send({content: "❌ Ah shite error: `" + err + "`", split: true}));

(async () => {
    await Promise.all([loadImages(), chessState.loadBoard()])
    require('./keepOnline.js')()

    //mongoose.connect(process.env.MONGODB_COMPASS, { useNewUrlParser: true, useUnifiedTopology: true })

    client.login(token)
})()