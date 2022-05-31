const { Client } = require('discord.js')

require('dotenv').config()

const chessmodule = require('./modules/chess')
const { command_with_its_group, loadSlashCommands } = require('./helper')

const command_groups = ['compiler', 'minecraft', 'music', 'utilities']
const prefix = 'wa'

const client = new Client({ intents: 641 }, { partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

client.once('ready', _ => {
  console.log('im on')
  client.user.setPresence({ status: 'idle', activities: [{ name: 'with sakura', type: 'PLAYING' }] })
})

client.on('messageCreate', async message => {
  if (message.author.bot) return

  let prefixed = message.content.substring(0, prefix.length).toLowerCase()
  let threads = message.content.split(' && ')
  
  if (prefixed == prefix || prefixed == 'bb' || prefixed == 'c!') {
    let strict_prefix
    
    threads.forEach(async (thread, index) => {
      if (prefixed == 'bb' && index == 0) return strict_prefix = true
      if (strict_prefix && index > 0 && thread.substring(0, prefix.length).toLowerCase() !== prefix) return

      let main = thread.replace(RegExp(prefixed == prefix? prefix : (strict_prefix? 'oi|c!' : 'c!'), 'gm'), '').replace(/^\s/gm, '')
      let cmd = main.split(/ +/g).shift().toLowerCase()

      if (prefixed == 'c!' && !chessmodule[cmd]) return chessmodule.move(message)

      let subcontents = main.split(' ')
      let arg2 = (cmd == subcontents[2] ? subcontents[2] : subcontents[1])?.trim()

      let exec = require('./modules/' + command_with_its_group[cmd])[cmd]
      exec.execute(message, arg2, main)
    })
  }
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return
  
  let commandName = interaction.commandName
  let exec = require('./modules/' + command_with_its_group[commandName])[commandName]
  let main = interaction.options.getString(exec.args)
  let arg2 = main?.split(' ')[0]

  exec.execute(interaction, arg2, main)
});

(async _ => {
    await Promise.all([
      require('./chess/images').loadImages(),
      require('./chess/chessBoard').loadBoard(),
      require('./modules/music')._init(client),

      require('http').createServer((_, res) => res.end('hanako ight')).listen(3000)
    ])

    await loadSlashCommands(command_groups)
    
    client.login(process.env.BOT_TOKEN)
})()