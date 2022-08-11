const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
//const { pagination } = require('reconlx')
const axios = require('axios')

const { bondapp, /*helppages,*/ sendMessage } = require('../helper')

module.exports = {
  bond: {
    slash: new SlashCommandBuilder()
    .setName('bond')
    .setDescription('Bond together with Discord Activities!')
    .addStringOption(option => option
      .setName('activity')
      .setDescription('Example: youtube')
      .setRequired(true)
      .addChoices(
        {name: 'youtube', value: '880218394199220334'},
        {name: 'poker', value: '755827207812677713'},
        {name: 'betrayal', value: '773336526917861400'},
        {name: 'fishing', value: '814288819477020702'},
        {name: 'chess', value: '832012774040141894'},
        {name: 'lettertile', value: '879863686565621790'},
        {name: 'wordsnack', value: '879863976006127627'},
        {name: 'doodlecrew', value: '878067389634314250'},
        {name: 'awkword', value: '879863881349087252'},
        {name: 'spellcast', value: '852509694341283871'},
        {name: 'checkers', value: '832013003968348200'},
        {name: 'puttparty', value: '763133495793942528'},
        {name: 'sketchyartist', value: '879864070101172255'}
      )
    )
    .toJSON(),

    args: 'activity',

    async execute(message, arg2) {
      let channel = message.member.voice.channel

      if (!channel) return sendMessage(message, '💔To bond, some of yall must join voice channels oki')
      if (!channel.permissionsFor(message.client.user).has(PermissionsBitField.Flags.CreateInstantInvite)) return sendMessage(message, '💕I need the create invite permission pls')

      let app = bondapp[arg2] || bondapp[Object.keys(bondapp).find(name => bondapp[name] == arg2)]
      if (!arg2 || !app) return sendMessage(message, '💕Some bonding activities I found: `youtube | poker | betrayal | fishing | chess | lettertile | wordsnack | doodlecrew | awkword | spellcast | checkers | puttparty | sketchyartist`')

      let invite = await channel.createInvite({
        maxAge: 86400,
        maxUses: 0,
        unique: true,
        targetApplication: app,
        targetType: 2
      })

      message.reply({
        embeds: [new EmbedBuilder()
          .setColor('#DD6e0F')
          .setTitle(`:revolving_hearts: ${invite.guild.name}'s bonding time uwu`)
          .setDescription(`Selected activity: **${invite.targetApplication.name}**`)
          .setThumbnail(invite.targetApplication.coverURL())
          .addFields(
            { name: invite.targetApplication.summary || '(no description for this activity yet,,)', value: '​' },
            { name: `Join ${invite.channel.name}:`, value: `https://discord.gg/${invite.code}` }
          )
          .setFooter({text: 'have fun bonding'})
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
      message.reply({
        embeds: [new EmbedBuilder()
          .setColor('#DD6E0F')
          .setTitle('🌸 Hanako')
          .setDescription('A bot with many fun stuff')
          .setThumbnail('https://i.imgur.com/RZKGQ7z.png')
          .addFields(
            {
              name: '**Prefix**: \`oi\`', value: `
              
              - - - - - - - Commands - - - - - - -
              
              **🛹 General**
              \`help\` | \`bond\` | \`chess\` | \`compile\`  | \`mcskin\`  | \`achieve\`  | \`ms\` | \`gato\` | \`say\` | \`wa\`
              
              **🎶 Music**
              \`filter\` | \`find\` | \`lyrics\` | \`play\`  | \`pause\`  | \`resume\`  | \`replay\` | \`remove\` | \`queue\` | \`skip\` | \`stop\`  | \`volume\`
              
              **🌸 Other**
              \`purge\`

              - - - - - - - - - - - - - - - - - - -
              `
            })
          .setTimestamp()
          .setFooter({text: 'fixing the help page rn'})
          ]
      })
      
      /*
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
      */
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
            embeds: [new EmbedBuilder()
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
        embeds: [new EmbedBuilder()
          .setColor('#DD6E0F')
          .setTitle('gato')
          .setImage(res.data[0].url)
        ],
        allowedMentions: { repliedUser: false }
      }))
    }
  },
  
  say: {
    slash: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Let me say something')
    .addStringOption(option => option
      .setName('string')
      .setDescription('ma say it')
      .setRequired(false))
    .toJSON(),

    args: 'string',

    async execute(message, arg2, main) {
      message.channel.send(arg2? main.substring(4, main.length) : 'you are fat')  
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
          embeds: [new EmbedBuilder()
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