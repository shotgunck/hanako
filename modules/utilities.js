const { MessageEmbed } = require('discord.js')
const { pagination } = require('reconlx')
const axios = require('axios')

const { setdb, getdb, bondapp } = require('../helper')
let prefix = 'oi'

function normal(message) {
  axios.get('https://api.waifu.im/random/?is_nsfw=false').then(res => {
    const info = res.data.images[0]
    message.channel.send({
      embeds: [new MessageEmbed()
        .setColor(info.dominant_color)
        .setTitle('wa')
        .setImage(info.url)
      ]
    })
  }).catch(err => message.channel.send(`wa wa err \`${err}\``))
}

module.exports = {
  init(database) {
    setdb(database)
  },

  async bond(message, _, arg2) {
    const app = bondapp[arg2]
    const channel = message.member.voice.channel

    if (!channel) return message.channel.send('💔To bond, some of yall must join voice channels oki')
    if (!channel.permissionsFor(message.guild.me).has('CREATE_INSTANT_INVITE')) return message.channel.send('💕I need the create invite permission pls')

    if (!arg2 || !app) return message.channel.send('💕Some bonding activities I found: `youtube | poker | betrayal | fishing | chess | lettertile | wordsnack | doodlecrew | awkword | spellcast | checkers | puttparty | sketchyartist`')

    const invite = await message.member.voice.channel.createInvite({
      maxAge: 86400,
      maxUses: 0,
      unique: true,
      targetApplication: app,
      targetType: 2
    })

    message.channel.send({
      embeds: [new MessageEmbed()
        .setColor('#DD6e0F')
        .setTitle(`:revolving_hearts: ${invite.guild.name}'s bonding time uwu`)
        .setDescription(`Selected activity: ${invite.targetApplication.name}`)
        .addFields(
          { name: invite.targetApplication.summary || '(no description for this activity yet,,)', value: '​' },
          { name: `Join ${invite.channel.name}:`, value: `https://discord.gg/${invite.code}` }
        )
        .setFooter('have fun bonding')
        .setTimestamp()
      ]
    })
  },

  async chess(message) {
    message.channel.send('♟ Prefix for chess is specified as `c!`, type `c! h` for more help ight')
  },

  async help(message) {
    //return message.channel.send('Help page is under rework comg')

    const pages = [
      new MessageEmbed()
        .setColor('#DD6E0F')
        .setTitle('Hanako')
        .setAuthor('', 'https://i.imgur.com/RZKGQ7z.png')
        .setDescription('created by shotgun#4239, written in JS')
        .setThumbnail('https://i.imgur.com/RZKGQ7z.png')
        .addFields(
          {
            name: '​', value: '💭 **Current prefix:** ' + prefix + '\n' + `
              -------------------------------
              **help**‎    - Show this message
              **prefix**‎  - Set a new prefix for me
          
              **bond**    - Bonding time with Discord activities
              **chess**‎   - Info about chess
              **compile**‎ - Code compiler
              **mcskin**‎  - Show skin of a Minecraft player
              **achieve**‎ - Achievement got!
              **ms**‎ ‎ ‎ ‎ ‎ ‎ - Get a Minecraft server's status
              **gato**‎ ‎ ‎ ‎ - Random gato picture
              **wa**‎ ‎ ‎ ‎ ‎ ‎ - wa?!
              -------------------------------
              `
          }),
      new MessageEmbed()
        .setColor('#DD6E0F')
        .setTitle('🎶 Music commands')
        .setDescription('Play some music in voice channels igh')
        .addFields(
          {
            name: '​', value: `
              -------------------------------
              **filter**‎ - Set a sound filter
              **find**‎ ‎ ‎ - Give me a song lyrics and I'll find the song
              **lyrics**‎ - Display the current sound's lyrics
              **play**‎ ‎ ‎ - Play a sound or add into queue
              **pause**‎ ‎ - Pause the current queue
              **resume**‎ ‎- Resume the current queue
              **replay** - Replay the current playing song
              **remove**‎ - Remove a song in given position from the queue
              **queue**‎ ‎ - Show the current queue
              **skip**‎ ‎ ‎ - Skip to the next sound in queue
              **stop**‎ ‎ ‎ - Stop the queue
              **volume**‎ - Set the bot's volume
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

    pagination({
      author: message.author,
      channel: message.channel,
      embeds: pages,
      button: [
        { name: 'previous', emoji: '⬅', style: 'DANGER' },
        { name: 'next', emoji: '➡', style: 'PRIMARY' }
      ],
      time: 50000
    })
  },

  async prefix(message, _, arg2) {
    if (arg2) {
      if (arg2 == 'c!') return message.channel.send('⚠♟ `c!` is preserved for chess game! Type `c! h` for more,.')
      if (arg2 == 'default') arg2 = 'oi'
      
      getdb().set(message.guild.id, arg2, 'prefix').then(() => {
        prefix = arg2
        message.channel.send(`❗ My prefix is now changed to \`${arg2}\`\n`)
      })
    } else message.channel.send(`Current prefix: \`${prefix}\`\nTo change prefix, type \`${prefix} prefix [new-prefix]\`\n\n`)
  },

  async purge(message, _, arg2) {
    if (message.author.id != message.guild.ownerId) return message.reply('♐ Only owner can abuse the command ight')
    if (!arg2 || isNaN(arg2)) return message.channel.send('♐ Provide an amount of messages to be purged in number!')

    const amount = parseInt(arg2) + 1
    if (amount > 0 && amount < 101) {
      message.channel.bulkDelete(amount, true).then(_ => message.channel.send({
        embeds: [new MessageEmbed()
          .setColor('#AA11EE')
          .setDescription(`♐ Purged ${amount - 1} messages!`)
          .setTimestamp()
        ]
      }).then(m => setTimeout(() => m.delete(), 2000))
      ).catch(err => message.channel.send({
        embeds: [new MessageEmbed()
          .setColor('#AA11EE')
          .setDescription(`❌ Error while purging | ${err}`)
          .setTimestamp()
        ]
      }).then(m => setTimeout(() => m.delete(), 10000))
      )
    } else message.channel.send('♐ You can only purge from 1 to 100 messages!')
  },

  async gato(message) {
    axios.get('https://aws.random.cat/meow?ref=apilist.fun').then(res => message.channel.send({
      embeds: [new MessageEmbed()
        .setColor('#DD6E0F')
        .setTitle('gato')
        .setImage(res.data.file)
      ]
    })
    )
  },

  async wa(message, _, arg2) {
    if (!message.channel.nsfw) return message.channel.send('Oui, nsfw channel only!')

    if (arg2) axios.get(process.env.SW + arg2).then(res => message.channel.send({
      embeds: [new MessageEmbed()
        .setColor('#DD6E0F')
        .setTitle('wa')
        .setImage(res.data.url)
      ]
    })).catch(_ => { normal(message) })
    else normal(message)
  }
}