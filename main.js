require('dotenv').config()

const { Client } = require('discord.js')
const { command_of_group, loadAllCommands } = require('./helper')

const prefix = 'oi'
const prefixes = ['mf', 'bb', 'ay']

const client = new Client({ intents: 33409 }, { partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'CONNECT'] })

client.once('ready', _ => {
  console.log('im on')
  client.user.setPresence({ status: 'idle', activities: [{ name: 'with shogi', type: 0 }] })
})

client.on('messageCreate', message => {
  if (message.author.bot) return

  let content = message.content
  let prefixed = content.substring(0, 2).toLowerCase()
  let threads = content.split(' && ')
  
  if (prefixed == prefix || prefixes.includes(prefixed)) {
    let strict_prefix
    
    threads.forEach(async (thread, index) => {
      if (prefixes.includes(prefixed) && index == 0) return strict_prefix = true
      if (strict_prefix && index > 0 && thread.substring(0, 2).toLowerCase() !== prefix) return

      let main = thread.replace(prefixed, '').replace(/^\s/gm, '')
      let cmd = main.split(/ +/g).shift().toLowerCase()

      let args = main.split(' ')
      let arg2 = (cmd == args[2] ? args[2] : args[1])?.trim()
      
      let exec = require('./modules/' + command_of_group[cmd])[cmd]
      if (exec) exec.execute(message, arg2, main)
    })
  }
})

client.on('interactionCreate', interaction => {
  if (!interaction.isCommand()) return
  
  let commandName = interaction.commandName
  let exec = require('./modules/' + command_of_group[commandName])[commandName]
  let main = interaction.options.getString(exec.args)
  let arg2 = main?.split(' ')[0]

  exec.execute(interaction, arg2, main)
});

(async _ => {
    await Promise.all([
      require('./modules/music')._init(client),
      require('http').createServer((_, res) => res.end('花子')).listen(3000)
    ])

    await loadAllCommands()
    
    client.login(process.env.BOT_TOKEN)
})()