const Discord = require('discord.js')

//const mongoose = require('mongoose')

const fs = require('fs')
require('dotenv').config()

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]}, {partials: ["MESSAGE", "CHANNEL", "REACTION"] })

const {loadImages} = require('./chess/images')
const chessState = require('./chess/chessBoard')

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
    const main = thread.replace(prefix + ' ', '')
    const subcontents = main.split(' ')
    prefixed = thread.substr(0, prefix.length).toLowerCase()

    const cmd = main.split(/ +/g).shift().toLowerCase()
    const arg2 = cmd == subcontents[1] ? subcontents[2] : subcontents[1]

    const module = function() {
        if (prefixed == prefix || prefixed == 'c!' || prefixed) {
          prefixed = true
          return fs.readdirSync('./modules').find(module => {
              const command = require('./modules/' + module)[cmd]
              if (command) return command
          })
        }
    }

    await module()? require('./modules/' + module())[cmd](message, main, arg2) : message.channel.send({content: '⭕ Command not found sob'}).then(m => setTimeout(() => m.delete(), 5000) )
  })
});

(async () => {
    await Promise.all([loadImages(), chessState.loadBoard()])
    require('http').createServer((_, res) => res.end('hanako ight')).listen()
    require('./modules/music').init(client)

    //mongoose.connect(process.env.MONGODB_COMPASS, { useNewUrlParser: true, useUnifiedTopology: true })
    
    client.login(process.env.BOT_TOKEN)
})()