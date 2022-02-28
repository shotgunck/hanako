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
  client.user.setPresence({status: 'idle', activities: [{name: 'with sakura', type: 'PLAYING'}]})
})

client.on('messageCreate', async message => {
  if (message.author.bot) return

  const prefix = await db.get(message.guild.id, 'prefix') || 'oi'
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
      const arg2 = cmd == subcontents[2] ? subcontents[2] : subcontents[1]

      const module = function() {
        return fs.readdirSync('./modules').find(m => {
          return require(`./modules/${m}`)[cmd]
        }) 
      }()

      if (!module) return
      await require(`./modules/${module}`)[cmd](message, main, arg2)
    })
  }
  
  /*
  if (prefixed == prefix || prefixed == 'bb' || prefixed == 'c!') {
    for (let thread of threads) {
      const main = thread.replace(RegExp(prefixed == prefix? prefix : 'c!', 'gm'), '').replace(/^\s/gm, '')
      const cmd = main.split(/ +/g).shift().toLowerCase()

      if (prefixed == 'c!' && !chessmodule[cmd]) return chessmodule.move(message)

      const subcontents = main.split(' ')
      const arg2 = cmd == subcontents[2] ? subcontents[2] : subcontents[1]

      const module = function() {
        return fs.readdirSync('./modules').find(m => {
          return require(`./modules/${m}`)[cmd]
        }) 
      }()

      if (!module) continue
      await require(`./modules/${module}`)[cmd](message, main, arg2)  
    }
  }
  */
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