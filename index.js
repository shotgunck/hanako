const Discord = require('discord.js')
const Distube = require('distube')
const DiscordSC = require('discord.js-slash-command')

const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()

const token = process.env.BOT_TOKEN

const client = new Discord.Client()
const distube = new Distube(client, { emitNewSongOnly: true})
const slash = new DiscordSC.Slash(client)

const {loadImages} = require('./chess/images')
const chessState = require('./chess/chessBoard')
const chessCommands = require('./chess/commands')

let config = require('./config.json')

client.once("ready", () => {
  console.log("im on")
  client.user.setActivity(config.prefix+" help", { type: "LISTENING" })

  let ms = new DiscordSC.CommandBuilder()
    .setName("ms")
    .setDescription('Display info of a Minecraft Server')
  let msChoice = new DiscordSC.CommandBuilder()
    .setName('address')
    .setDescription('Server address')
    .setRequired(true)
    .setType(DiscordSC.CommandType.STRING)

  ms.addOption(msChoice)
  slash.create(ms, "802005325196558356")
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
  .on('finish', message => message.channel.send("😴 **Queue ended.**").then(m => m.delete({timeout: 5000})))
  .on("playSong", (message, queue, song) => {message.channel.send('🎶**'+song.name+'** - ``'+song.formattedDuration+'`` is now playing!');
      queue.autoplay = false
  })
  .on("addSong", (message, _, song) => {message.channel.send(`**${song.name}** - \`${song.formattedDuration}\` has been added to the queue ight`)
  })
  .on("error", (message, err) => message.channel.send("❌ Ah shite error: `" + err + "`", {split: true}))

slash.on("slashInteraction", interaction => {
  console.log(interaction.command.options[0].value)
  fs.readdir('./modules', function (err, files) {       
    files.forEach(function (file, _) {
      const command = require('./modules/'+file)[interaction.command.name]
      if (command) {
        command(interaction, interaction.command.options[0].value, distube)
      }
    })
  })
  interaction.callback("siudgiufugsdui")
});

async function init() {
    await Promise.all([loadImages(), chessState.loadBoard()])
    require('./keepOnline.js')()
    client.login(token)
}
init()