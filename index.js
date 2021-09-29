const Discord = require('discord.js')
const Distube = require('distube')

const dotenv = require('dotenv')
dotenv.config()

const token = process.env.BOT_TOKEN

const client = new Discord.Client()
const distube = new Distube(client, { emitNewSongOnly: true})

const chessState = require('./chess/chessBoard')
const {loadImages} = require('./chess/images')

const chessCommands = require('./chess/commands')
const musicCommands = require('./modules/music')
const utilCommands = require('./modules/utilities')
const mcCommands = require('./modules/minecraft')

let config = require('./config.json')

client.once("ready", () => {
  console.log("im on")
  client.user.setActivity(config.prefix+" help", { type: "LISTENING" })
})

client.on("message", async message => {
  if (message.author.bot) return
  
  const prefix = config.prefix
  const content = message.content
  const subcontents = content.split(' ')
  const prefixed = content.substr(0, prefix.length).toLowerCase()

  const cmd = content.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase()
  const arg2 = cmd === subcontents[1] ? subcontents[2] : subcontents[1]

  if (prefixed === "c!") {
    const command = chessCommands[cmd] || chessCommands.move
      if (command) {
        command(message, subcontents)
      }

  } else if (prefixed === prefix) {
    const command = musicCommands[cmd] || utilCommands[cmd] || mcCommands[cmd]
      if (command) {
       command(message, arg2, distube)
      }
  }
  
})

distube
  .on('finish', message => message.channel.send("😴 **Queue ended.**"))
  .on("playSong", (message, queue, song) => {message.channel.send('🎶**'+song.name+'** - ``'+song.formattedDuration+'`` is now playing!');
      queue.autoplay = false
  })
  .on("addSong", (message, _, song) => {message.channel.send(`**${song.name}** - \`${song.formattedDuration}\` has been added to the queue ight`)
  })
  .on("error", (message, err) => message.channel.send("❌ Ah shite error: `" + err + "`"));

const init = async () => {
    await Promise.all([loadImages(), chessState.loadBoard()])
    require('./keepOnline.js')()
    client.login(token)
}
init()