const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const axios = require('axios')

const { getPrefix, msgEdit, sendMessage } = require('../helper')

module.exports = {
  mcskin: {
    slash: new SlashCommandBuilder()
      .setName('mcskin')
      .setDescription('Show a Minecraft player\'s skin')
      .addStringOption(option => option
        .setName('username')
        .setDescription('Example: notch')
        .setRequired(true))
      .toJSON(),

    args: 'username',

    async execute(message, arg2) {
      if (!arg2) return message.reply(`🙄 Provide a Minecraft player's username,, like \`${await getPrefix(message.guild.id)} mcskin notch\``)
      message.reply({
        embeds: [new MessageEmbed()
          .setColor('#DD6E0F')
          .setTitle(arg2)
          .setImage(`https://minotar.net/armor/body/${arg2}/150.png`)
        ],

        allowedMentions: { repliedUser: false }
      })
    }
  },

  achieve: {
    slash: new SlashCommandBuilder()
      .setName('achieve')
      .setDescription('Achievement got!')
      .addStringOption(option => option
        .setName('achievement')
        .setDescription('Example: do..a..backflip')
        .setRequired(true))
      .toJSON(),

    args: 'achievement',

    execute(message, _, main) {
      const args = main.slice(7).trim().split(/ +/g).join('..')
      axios.get(`https://minecraft-api.com/api/achivements/cooked_salmon/achievement..got/${args}`).then(data => message.reply({
        embeds: [new MessageEmbed()
          .setColor('#DD6E0F')
          .setImage(data.config.url)
        ],

        allowedMentions: { repliedUser: false }
      }))
    } 
  },

  ms: {
    slash: new SlashCommandBuilder()
      .setName('ms')
      .setDescription('Display a Minecraft server status')
      .addStringOption(option => option
        .setName('address')
        .setDescription('Example: hypixel.net')
        .setRequired(true))
      .toJSON(),

    args: 'address',

    async execute(message, arg2) {
      if (!arg2) return message.reply('💢 Pls provide a Minecraft server bru')    
      let status = await sendMessage(message, '🕹 Getting server info, please wait.. (if it takes too long it\'s prob offline)')

      axios.get(`https://eu.mc-api.net/v3/server/ping/${arg2}`).then(res => {
        const data = res.data

        if (!data.online) {
          const notCharacter = arg2.search(/[^\w.:]/gm) == -1 ? '🕐 Try again in 5 minutes!' : '🔹 Did you mean: `' + arg2.replace(/[^\w.:]/gm, '') + '`'

          return msgEdit(status, {
            embeds: [new MessageEmbed()
              .setColor('#DD6E0F')
              .setTitle('\\🔴 ' + arg2 + ' is offline')
              .setDescription(`🔸 Make sure the address is an existing Minecraft server address, or let the server owner know!\n${notCharacter}`)
              .setTimestamp()
            ],

            allowedMentions: { repliedUser: false }
          })
        }

        const players = data.players
        const sample = players.sample || [{ name: '' }]
        const desc = data.description
        const descExtra = desc.extra, descText = desc.text

        let ping = data.took
        ping += 'ms ' + (ping >= 1000 ? '[WTF]' : (ping >= 400 && ping < 1000) ? '[Bad]' : (ping >= 150 && ping < 400) ? '[avg]' : (ping >= 25 && ping < 150) ? '[OK]' : '[fast af]')

        let listofplayer = ''
        sample.map(plr => listofplayer += `\n• ${plr.name}`)

        msgEdit(status, {
          embeds: [new MessageEmbed()
            .setColor('#DD6E0F')
            .setTitle(`🟢 ${arg2} is online`)
            .setDescription(descExtra ? descExtra[1].text : (descText || desc))
            .setThumbnail(data.favicon)
            .addFields(
              {
                name: '🔷Info', value: `-------------------------------\n
		         	    **Version**:  ${data.version.name}
                  \n**Ping**: ${ping}
                	\n**Players in game:**  ${players.online}/${players.max + listofplayer}
                  \n-------------------------------\n🔸 This is a cached result. Please check again in ${data.cache.ttl} seconds!`
              }
            )
            .setTimestamp()
          ],

          allowedMentions: { repliedUser: false }
        })
      }).catch(err => msgEdit(status, `🏥 Error!! ${err}`))
    }
  }
}