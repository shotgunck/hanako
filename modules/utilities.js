const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { pagination } = require('reconlx')
const axios = require('axios')

const { bondapp, bondapp_slash, getdb, helppages, sendMessage } = require('../helper')
let prefix = 'oi'

module.exports = {
  bond: {
    slash: new SlashCommandBuilder()
    .setName('bond')
    .setDescription('Bond together with Discord Activities!')
    .addStringOption(option => option
      .setName('activity')
      .setDescription('Example: youtube')
      .setRequired(true)
      .addChoices(bondapp_slash)
    )
    .toJSON(),

    args: 'activity',

    async execute(message, arg2) {
      const channel = message.member.voice.channel

      if (!channel) return sendMessage(message, '💔To bond, some of yall must join voice channels oki')
      if (!channel.permissionsFor(message.guild.me).has('CREATE_INSTANT_INVITE')) return sendMessage(message, '💕I need the create invite permission pls')

      const app = bondapp[arg2] || bondapp[Object.keys(bondapp).find(name => bondapp[name] == arg2)]
      if (!arg2 || !app) return sendMessage(message, '💕Some bonding activities I found: `youtube | poker | betrayal | fishing | chess | lettertile | wordsnack | doodlecrew | awkword | spellcast | checkers | puttparty | sketchyartist`')

      const invite = await channel.createInvite({
        maxAge: 86400,
        maxUses: 0,
        unique: true,
        targetApplication: app,
        targetType: 2
      })

      message.reply({
        embeds: [new MessageEmbed()
          .setColor('#DD6e0F')
          .setTitle(`:revolving_hearts: ${invite.guild.name}'s bonding time uwu`)
          .setDescription(`Selected activity: ${invite.targetApplication.name}`)
          .setThumbnail(invite.targetApplication.coverURL())
          .addFields(
            { name: invite.targetApplication.summary || '(no description for this activity yet,,)', value: '​' },
            { name: `Join ${invite.channel.name}:`, value: `https://discord.gg/${invite.code}` }
          )
          .setFooter('have fun bonding')
          .setTimestamp()
        ],

        allowedMentions: { repliedUser: false }
      })
    }
  },

  chess: {
    slash: new SlashCommandBuilder()
    .setName('chess')
    .setDescription('Play some chess!')
    .toJSON(),

    execute(message) {
      sendMessage(message, '♟ Prefix for chess is specified as `c!`, type `c! h` for more help ight, or you can use Discord activities!')
    }
  },

  help: {
    slash: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show my info and commands')
    .toJSON(),

    async execute(message) {
      if (message.deleteReply) {
        const reply = await sendMessage(message, '​')
        reply.edit('💛_ _')
      }

      pagination({
        author: message.author?.id? message.author : message.user,
        channel: message.channel,
        embeds: await helppages(message.guild.id),
        button: [
          { name: 'previous', emoji: '⬅', style: 'DANGER' },
          { name: 'next', emoji: '➡', style: 'PRIMARY' }
        ],
        time: 50000
      })
    }
  },

  prefix: {
    slash: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('Set a new prefix for the guild')
    .addStringOption(option => option
      .setName('prefix')
      .setDescription('Example: !')
      .setRequired(true))
    .toJSON(),

    args: 'prefix',

    async execute(message, arg2) {
      if (arg2) {
        if (arg2 == 'c!') return sendMessage(message, '⚠♟ `c!` is preserved for chess game! Type `c! h` for more,.')
        if (arg2 == 'default') arg2 = 'oi'
        
        getdb().set(message.guild.id, arg2, 'prefix').then(() => {
          prefix = arg2
          sendMessage(message, `❗ My prefix is now changed to \`${arg2}\`\n`)
        })
      } else sendMessage(message, `Current prefix: \`${prefix}\`\nTo change prefix, type \`${prefix} prefix [new-prefix]\`\n\n`)
    }
  },

  purge: {
    slash: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete multiple messages')
    .addStringOption(option => option
      .setName('amount')
      .setDescription('Amount of message to be deleted')
      .setRequired(true))
    .toJSON(),
 
    args: 'amount',

    async execute(message, arg2) {
      if ((message.author?.id || message.user.id) != message.guild.ownerId) return sendMessage(message, '♐ Only owner can abuse the command ight')
      if (!arg2 || isNaN(arg2)) return message.reply('♐ Provide an amount of messages to be purged in number!')

      const amount = parseInt(arg2) + 1

      sendMessage(message, `♐ Purging ${amount - 1} messages..`)

      if (amount > 0 && amount <= 101) {
        message.channel.bulkDelete(amount, true).catch(err => {
          return message.reply({
            embeds: [new MessageEmbed()
              .setColor('#AA11EE')
              .setDescription(`❌ Error while purging | ${err}`)
              .setTimestamp()
            ]
          })
        })
      } else return sendMessage(message, '♐ You can only purge from 1 to 100 messages!')
    }
  },

  gato: {
    slash: new SlashCommandBuilder()
    .setName('gato')
    .setDescription('Random gato pictures')
    .toJSON(),

    async execute(message) {
      axios.get('https://api.thecatapi.com/v1/images/search').then(res => message.reply({
        embeds: [new MessageEmbed()
          .setColor('#DD6E0F')
          .setTitle('gato')
          .setImage(res.data[0].url)
        ],
        allowedMentions: { repliedUser: false }
      }))
    }
  },
  
  wa: {
    slash: new SlashCommandBuilder()
    .setName('wa')
    .setDescription('Random waifu pictures')
    .addStringOption(option => option
      .setName('lang')
      .setDescription('aghpb')
      .setRequired(false))
    .toJSON(),

    args: 'lang',

    async execute(message, arg2) {
      if (!message.channel.nsfw) return sendMessage(message, 'Oui, nsfw channel only!')
      const channel = message.channel

      const url = arg2? `${process.env.SW}${arg2}` : 'https://api.waifu.im/random/?is_nsfw=false'

      axios.get(url).then(res => {
        const info = res.data.images? res.data.images[0] : res.data

        const embed = {
          embeds: [new MessageEmbed()
            .setColor(info.dominant_color || '#DD6E0F')
            .setTitle('wa')
            .setDescription(`Favorites: ${info.favourites || 'idk'}\nSource: ${info.source || 'idk'}`)
            .setImage(info.url)
            .setTimestamp()
          ],
          allowedMentions: { repliedUser: false }
        }

        if (message.reply) message.reply(embed)
        else channel.send(embed)
      }).catch(err => { message.reply('💢 wa error :( ' + err) })
    }
  }
}