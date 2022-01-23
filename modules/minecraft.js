const { MessageEmbed } = require('discord.js')
const axios = require('axios')

const helper = require('../helper')

module.exports = {
    async mcskin(message, _, arg2) {
      if (!arg2) return message.channel.send(`🙄 Provide a Minecraft player's username,, like \`${await helper.prefix(message.guild.id)} mcskin notch\``)
      message.channel.send(`🔶 Getting **${arg2}** skin..,`).then(m => setTimeout(() => m.delete(), 750))
      
      message.channel.send({ embeds: [new MessageEmbed() 
        .setColor('#DD6E0F')
        .setTitle(arg2)
        .setImage(`https://minotar.net/armor/body/${arg2}/150.png`)
      ]})
    },

    achieve(message, main) {
      const args = main.slice(7).trim().split(/ +/g).join('..')
      axios.get('https://minecraft-api.com/api/achivements/cooked_salmon/achievement..got/'+args)
      .then(data => {
        message.channel.send({ embeds: [new MessageEmbed() 
            .setColor('#DD6E0F')
            .setImage(data.config.url)
        ]})
      })
    },

    async ms(message, _, arg2) {
      if (!arg2) return message.channel.send('💢 Pls provide a Minecraft server bru')
      var notCharacter = arg2.search(/[^\w.:]/gm) == -1? '🕐 Try again in 5 minutes!' : '🔹 Did you mean: `'+arg2.replace(/[^\w.:]/gm, '')+'`'
      message.channel.send('🕹 Getting server info, please wait.. (if it takes too long it\'s prob offline)').then(m => setTimeout(() => m.delete(), 2000))

		  axios.get(`https://eu.mc-api.net/v3/server/ping/${arg2}`).then(res => {
        const data = res.data
          if (!data.online) message.channel.send({ embeds: [new MessageEmbed() 
          	  .setColor('#DD6E0F')
          	  .setTitle('\\🔴 '+arg2+' is offline')
              .setDescription(`🔸 Make sure the address is an existing Minecraft server address, or let the server owner know!\n${notCharacter}`)
          	  .setTimestamp()
            ]})
          else {
              const players = data.players
              const sample = players.sample || [{name: ''}]
              const desc = data.description

              let listofplayer = ''
              let ping = data.took
              ping += 'ms ' + (ping >= 1000? '[WTF]': (ping >= 400 && ping < 1000)? '[Bad]' : (ping >= 150 && ping < 400)? '[avg]' : (ping >= 25 && ping < 150)? '[OK]': '[fast af]')

              sample.map(plr => listofplayer += `\n• ${plr.name}`)

              message.channel.send({ embeds: [new MessageEmbed() 
              	.setColor('#DD6E0F')
              	.setTitle('\\🟢 '+arg2+' is online')
			         	.setDescription(desc.extra? desc.extra[1].text : (desc.text? desc.text : desc))
	  	         	.setThumbnail(data.favicon)
              	.addFields(
                 	{ name: '​', value: `**🔹 Info: **\n                -------------------------------\n
		         	    **Version**:  ${data.version.name}
                  \n**Ping**: ${ping}
                	\n**Players in game:**  ${players.online}/${players.max + listofplayer}
                  \n-------------------------------\n🔸 This is a cached result. Please check again in ${data.cache.ttl} seconds!`
               	  }
                )
                .setTimestamp()
              ]}) 
          }
      }).catch(err => message.reply(`🏥 Error!! ${err}`))
    }
}