const Discord = require('discord.js')

const mongoose = require('mongoose')
const fs = require('fs')

require('dotenv').config()

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]}, {partials: ["MESSAGE", "CHANNEL", "REACTION"] })

const config = require('./config.json')

client.on('ready', () => {
  console.log('im on')
  client.user.setActivity(config.prefix+' help', { type: 'LISTENING' })
})

client.on('messageCreate', async message => {
  if (message.author.bot) return
  
  const prefix = config.prefix
  var prefixed = false

  message.content.split(' && ').forEach(async thread => {
    prefixed = thread.substring(0, prefix.length).toLowerCase()
    if (prefixed == prefix || prefixed == 'c!' || prefixed) {
      prefixed = true
      
      const main = thread.replace(RegExp(prefix, 'gm'), '').replace(/^\s/gm, '')
      const subcontents = main.split(' ')

      const cmd = main.split(/ +/g).shift().toLowerCase()
      const arg2 = cmd == subcontents[1] ? subcontents[2] : subcontents[1]

      const module = function() {
        return fs.readdirSync('./modules').find(modul => {
          const command = require('./modules/' + modul)[cmd]
          if (command) return command
        }) 
      }()
      
      if (!module) return message.channel.send('⭕ Command not found sob').then(m => setTimeout(() => m.delete(), 5000) )
      await require('./modules/' + module)[cmd](message, main, arg2)
    }
  })
});

(async () => {
    await Promise.all([
      require('./chess/images').loadImages(),
      require('./chess/chessBoard').loadBoard(),
      require('http').createServer((_, res) => res.end('hanako ight')).listen(),
      require('./modules/music').init(client),
      mongoose.connect(process.env.MONGODB_COMPASS, { useNewUrlParser: true, useUnifiedTopology: true })
    ])
    
    client.login(process.env.BOT_TOKEN)
})()