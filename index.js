const { Client } = require('discord.js')

const chessmodule = require('./modules/chess')
const fs = require('fs')
require('dotenv').config()

const { MongoClient } = require('mongodb')
const { Collection, Fields } = require('quickmongo')

const client = new Client({intents: 641}, {partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

const mongo = new MongoClient(process.env.MONGODB_COMPASS)
const schema = new Fields.ObjectField({
    prefix: new Fields.StringField()
})

let db

mongo.connect().then(() => {      
    const mongoCollection = mongo.db().collection('JSON')
    db = new Collection(mongoCollection, schema)
    require('./modules/utilities').init(db)
})

client.on('ready', () => {
  console.log('im on')
  client.user.setPresence({status: 'idle', activities: [{name: 'oi help', type: 'LISTENING'}]})
})

client.on('messageCreate', async message => {
  if (message.author.bot) return

  const prefix = await db.get(message.guild.id, 'prefix') || 'oi'
  const prefixed = message.content.substring(0, prefix.length).toLowerCase()

  if (prefixed == prefix || prefixed == 'c!') {
    for (thread of message.content.split(' && ')) {   
      const main = thread.replace(RegExp(prefixed == prefix? prefix : 'c!', 'gm'), '').replace(/^\s/gm, '')
      const subcontents = main.split(' ')

      const cmd = main.split(/ +/g).shift().toLowerCase()
      const arg2 = cmd == subcontents[1] ? subcontents[2] : subcontents[1]

      if (prefixed == 'c!' && !chessmodule[cmd]) return chessmodule.move(message)

      const module = function() {
        return fs.readdirSync('./modules').find(modul => {
          const command = require(`./modules/${modul}`)[cmd]
          if (command) return command
        }) 
      }()

      if (!module) return
      await require(`./modules/${module}`)[cmd](message, main, arg2)  
    }
  }
});

(async () => {
    await Promise.all([
      require('./chess/images').loadImages(),
      require('./chess/chessBoard').loadBoard(),
      require('./modules/music').init(client),

      require('http').createServer((_, res) => res.end('hanako ight')).listen()
    ])
  
    client.login(process.env.BOT_TOKEN)
})()