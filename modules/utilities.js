const { MessageEmbed } = require('discord.js')
const axios = require('axios')
const { pagination } = require('reconlx')

require('dotenv').config()

const config = require('../config.json')
const helper = require('../helper')

let prefix = config.prefix
const lock = false

module.exports = {
    bonding: async (message, _, arg2) => {
      const app = helper.bondapp[arg2]
      if (!arg2 || !app) return message.channel.send('💕Some bonding activities I found: `youtube | poker | betrayal | fishing | chess | lettertile | wordsnack | doodlecrew | awkword | spellcast | checkers | puttparty | sketchyartist`')
      const channel = message.member.voice.channel
        if (!channel) return message.channel.send('To bond, some of yall must join voice channels oki')
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send('I need the create invite permission pls')

        const data = JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: app,
                target_type: 2,
                temporary: false,
                validate: null
          })
        const headers = {
              "Authorization": `Bot ${process.env.BOT_TOKEN}`,
              "Content-Type": "application/json"
          }
        axios.post(`https://discord.com/api/v8/channels/${channel.id}/invites`, data, {headers}).then(res => {
          const invite = res.data
          if (invite.error || !invite.code) return message.channel.send('Can\'t bond rn, prob there\'s error or invalid code,,')

          message.channel.send({embeds: [new MessageEmbed()
            .setColor('#DD6e0F')
            .setTitle('💕'+invite.guild.name+'\'s bonding time uwu')
            .setDescription(`Selected activity: ${invite.target_application.name}`)
            .addFields(
              {name: invite.target_application.description || '(no description for this activity, but I assume youtube so have fun times watching!)', value: '​'},
              {name: `Join ${invite.channel.name}:`, value: `https://discord.gg/${invite.code}`}
            )
            .setFooter('ight have fun')
            .setTimestamp()
          ]})
        }).catch(e => {
            message.channel.send('💔Cannot bond cus error :( `'+e+'`');
        })
    },

    chess: async message => {
        message.channel.send('♟ Prefix for chess is specified as `c!`, type `c! h` for more help ight')
    },
    
    help: async message => {
      //return message.channel.send('Help page is under rework comg')
         
      const pages = [new MessageEmbed()
        .setColor('#DD6E0F')
        .setTitle('Hanako')
        .setAuthor('', 'https://i.imgur.com/RZKGQ7z.png')
        .setDescription('created by shotgun#4239, written in JS')
        .setThumbnail('https://i.imgur.com/RZKGQ7z.png')
        .addFields(
          { name: '​', value: '💭 **Current prefix:** '+prefix+'\n'+`
            -------------------------------
            **help**‎ ‎ ‎ ‎ - Show this message
            **prefix**‎ ‎ - Set a new prefix for me
    
            **chess**‎ ‎ ‎ - Info about chess
            **compile**‎ - Code compiler
            **mcskin**‎ ‎ - Show skin of a Minecraft player
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
          { name: '​', value: `
            -------------------------------
            **filter**‎ - Set a sound filter
            **find**‎ ‎ ‎ - Give me a song lyrics and I'll find the song
            **lyrics**‎ - Display the current sound's lyrics
            **play**‎ ‎ ‎ - Play a sound or add into queue
            **pause**‎ ‎ - Pause the current queue
            **resume**‎ ‎- Resume the current queue
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
          { name: '​', value: `
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
          {name: 'previous', emoji: '⬅', style: 'DANGER'},
          {name: 'next', emoji: '➡', style: 'PRIMARY'}
        ],
        time: 20000
      })
    },
    
    prefix: async (message, _, arg2) => {
        if (arg2) {
            if (arg2 == 'c!') return message.channel.send('⚠♟ `c!` is preserved for chess game! Type `c! h` for more,.')
            
            config.prefix = arg2
            prefix = config.prefix

            message.channel.send('❗ My prefix is now changed to `'+arg2+'`\n❗ In case you forgot what the prefix is, see what I\'m listening to!')
            if (arg2 == 'default') {
                message.channel.send('⚠ Note: it will literally be `default`, **__not__** `oi`.')
            }
            message.client.user.setActivity(prefix + ' help', { type: "LISTENING" })
        } else {
            message.channel.send('Current prefix: `'+prefix+'`\nTo change prefix, type `'+prefix+'` prefix [new-prefix]`\n\n❗ In case you forgot what the prefix is,  see what I\'m listening to!')
        }
    },

    purge: async(message, _, arg2) => {
      if (message.author.id != message.guild.ownerId) return message.reply('♐ Only owner can abuse the command ight')
      if (!arg2 || isNaN(arg2)) return message.channel.send('♐ Provide an amount of messages to be purged in number!')
      
      const amount = parseInt(arg2) + 1
      if (amount > 0 && amount < 101) {
        message.channel.bulkDelete(amount, true).then(_ => {
          message.channel.send({embeds: [new MessageEmbed()
            .setColor('#AA11EE')
            .setDescription('♐ Purged '+(amount - 1)+' messages!')
            .setTimestamp()
          ]}).then(m => setTimeout(() => m.delete(), 2000))
        }).catch(err => {
          message.channel.send({embeds: [new MessageEmbed()
            .setColor('#AA11EE')
            .setDescription('❌ Error while purging | '+err)
            .setTimestamp()
          ]}).then(m => setTimeout(() => m.delete(), 10000))
        })
      } else {
        message.channel.send('♐ You can only purge from 1 to 100 messages!')
      }
    },

    gato: async(message) => {
        axios.get('https://aws.random.cat/meow?ref=apilist.fun')
        .then(res => {
            message.channel.send({ embeds: [new MessageEmbed()
                .setColor('#DD6E0F')
                .setTitle('gato')
                .setImage(res.data.file)
            ]})
        })
    },

    wa: async(message) => {
      if (lock) return message.channel.send('noj,,,')
      axios.get('https://api.waifu.pics/sfw/waifu')
        .then(res => {
            if (message.channel.nsfw) {
              message.channel.send({ embeds: [new MessageEmbed()
                .setColor('#DD6E0F')
                .setTitle('wa')
                .setImage(res.data.url)
              ]})
            } else {
              message.channel.send('Oui, nsfw channel only!')
            }
        })
    }
}