const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { MessageEmbed } = require('discord.js')

const command_with_its_group = {}

module.exports = {
  msgSplit(msg) {
    return [
      msg.substring(0, 1999),
      msg.substring(2000, 3999)
    ]
  },

  bondapp: {
    youtube: '880218394199220334',
    poker: '755827207812677713',
    betrayal: '773336526917861400',
    fishing: '814288819477020702',
    chess: '832012774040141894',
    lettertile: '879863686565621790',
    wordsnack: '879863976006127627',
    doodlecrew: '878067389634314250',
    awkword: '879863881349087252',
    spellcast: '852509694341283871',
    checkers: '832013003968348200',
    puttparty: '763133495793942528',
    sketchyartist: '879864070101172255'
  },

  bondapp_slash: [
    ['youtube', '880218394199220334'],
    ['poker', '755827207812677713'],
    ['betrayal', '773336526917861400'],
    ['fishing', '814288819477020702'],
    ['chess', '832012774040141894'],
    ['lettertile', '879863686565621790'],
    ['wordsnack', '879863976006127627'],
    ['doodlecrew', '878067389634314250'],
    ['awkword', '879863881349087252'],
    ['spellcast', '852509694341283871'],
    ['checkers', '832013003968348200'],
    ['puttparty', '763133495793942528'],
    ['sketchyartist', '879864070101172255']
  ],

  async helppages() {
    return [
      new MessageEmbed()
        .setColor('#DD6E0F')
        .setTitle('Hanako')
        .setAuthor('', 'https://i.imgur.com/RZKGQ7z.png')
        .setDescription('created by shotgun#4239, written in JS')
        .setThumbnail('https://i.imgur.com/RZKGQ7z.png')
        .addFields(
          {
            name: '​', value: `💭 **Prefix:** \`oi\`
              -------------------------------
              **help** - Show this message
              **prefix** - Set a new prefix for me
          
              **bond** - Bonding time with Discord activities
              **chess** - Info about chess
              **compile** - Code compiler
              **mcskin** - Show skin of a Minecraft player
              **achieve** - Achievement got!
              **ms** - Get a Minecraft server's status
              **gato** - Random gato picture
              **wa** - wa?!
              -------------------------------
              `
          }),
      new MessageEmbed()
        .setColor('#DD6E0F')
        .setTitle('🎶 Music commands')
        .setDescription('Play some music in voice channels')
        .addFields(
          {
            name: '​', value: `
              -------------------------------
              **filter** - Set a sound filter
              **find** - Give me a song lyrics and I'll find the song
              **lyrics** - Display the current sound's lyrics
              **play** - Play a sound or add into queue
              **pause** - Pause the current queue
              **resume** - Resume the current queue
              **replay** - Replay the current playing song
              **remove** - Remove a song in given position from the queue
              **queue** - Show the current queue
              **skip** - Skip to the next sound in queue
              **stop** - Stop the queue
              **volume** - Set the bot's volume
              -------------------------------
              `
          })
        .setTimestamp(),

      new MessageEmbed()
        .setColor('#DD6E0F')
        .setTitle('♐ Moderation commands')
        .setDescription('CommandCleanup is down sometimes')
        .addFields(
          {
            name: '​', value: `
              -------------------------------
              **purge** - Purge messages
              -------------------------------
              `
          })
        .setTimestamp()
        .setFooter('ight have fun')
    ]
  },

  async loadSlashCommands(cmd_groups) {
    let rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

    let commands = []

    for (let cmd_group of cmd_groups) {
      let module = require(`./modules/${cmd_group}`)
      for (let cmd in module) {
        let slash_info = module[cmd].slash

        command_with_its_group[cmd] = cmd_group
        if (slash_info) commands.push(slash_info)
      }
    }

    await rest.put( Routes.applicationCommands(process.env.BOT_CLIENT_ID), { body: commands } )
  },

  command_with_its_group,

  async sendMessage(message, text) {
    let reply = await message.reply({
      content: text,
      allowedMentions: { repliedUser: false }
    })

    return message.fetchReply? await message.fetchReply() : reply
  },

  async sendCustomMessage(message, info) {
    let reply = await message.reply(info)

    return message.fetchReply? await message.fetchReply() : reply
  },

  msgDelete(message, when) {
    setTimeout(_ => {
      if (deleted_msgs[message.id] == message) (message.delete || message.deleteReply)()
    }, when * 1000)
  },
  async msgEdit(message, what, mention = false) {
    let info, edited

    if (typeof(what) === 'string') info = {
      content: what,
      allowedMentions: { repliedUser: mention }
    }
    else info = what

    if (message.fetchReply) edited = await message.fetchReply().editReply(info)
    else edited = await message.edit(info)

    return edited
  },

  langVersion: {
    java: 3, c: 4, cpp: 4, php: 3, perl: 3, python3: 3, ruby: 3, go: 3, clojure: 2, sql: 3, csharp: 3, objc: 3, swift: 3, brainfuck: 0, lua: 2, rust: 3, nodejs: 3, coffeescript: 3, elixir: 3, lolcode: 0, kotlin: 2, groovy: 3, octave: 3
  }
}