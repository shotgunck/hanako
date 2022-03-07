const { Client } = require('discord.js')
const { MongoClient } = require('mongodb')
const { Collection, Fields } = require('quickmongo')

require('dotenv').config()

const chessmodule = require('./modules/chess')
const { command_with_its_group, getPrefix, loadSlashCommands, setdb } = require('./helper')

const command_groups = ['compiler', 'minecraft', 'music', 'utilities']

const client = new Client({ intents: 641 }, { partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const mongo = new MongoClient(process.env.MONGODB_COMPASS)
const schema = new Fields.ObjectField({
    prefix: new Fields.StringField()
})

client.once('ready', _ => {
  console.log('im on')
  client.user.setPresence({ status: 'idle', activities: [{ name: 'with sakura', type: 'PLAYING' }] })
})

client.on('messageCreate', async message => {
  if (message.author.bot) return

  const prefix = await getPrefix(message.guild.id) || 'oi'
  const prefixed = message.content.substring(0, prefix.length).toLowerCase()
  const threads = message.content.split(' && ')
  
  if (prefixed == prefix || prefixed == 'bb' || prefixed == 'c!') {
    let strict_prefix
    
    threads.forEach(async (thread, index) => {
      if (prefixed == 'bb' && index == 0) return strict_prefix = true
      if (strict_prefix && index > 0 && thread.substring(0, prefix.length).toLowerCase() !== prefix) return

      const main = thread.replace(RegExp(prefixed == prefix? prefix : (strict_prefix? 'oi|c!' : 'c!'), 'gm'), '').replace(/^\s/gm, '')
      const cmd = main.split(/ +/g).shift().toLowerCase()

      if (prefixed == 'c!' && !chessmodule[cmd]) return chessmodule.move(message)

      const subcontents = main.split(' ')
      const arg2 = (cmd == subcontents[2] ? subcontents[2] : subcontents[1])?.trim()

      const exec = require('./modules/' + command_with_its_group[cmd])[cmd]
      exec.execute(message, arg2, main)
    })
  }
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return
  
  const commandName = interaction.commandName
  const exec = require('./modules/' + command_with_its_group[commandName])[commandName]
  const main = interaction.options.getString(exec.args)
  const arg2 = main?.split(' ')[0]

  exec.execute(interaction, arg2, main)
});

(async _ => {
    await Promise.all([
      require('./chess/images').loadImages(),
      require('./chess/chessBoard').loadBoard(),
      require('./modules/music')._init(client),

      require('http').createServer((_, res) => res.end('hanako ight')).listen()
    ])

    await loadSlashCommands(command_groups)
    
    mongo.connect().then(_ => {      
      const mongoCollection = mongo.db().collection('JSON')
      const db = new Collection(mongoCollection, schema)
      setdb(db)

      client.login(process.env.BOT_TOKEN)
    })
})()