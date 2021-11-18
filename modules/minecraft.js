const Discord = require('discord.js')
const axios = require('axios')

require('dotenv').config()

const config = require('../config.json')

module.exports = {
    mcskin: (message, arg2) => {
      if (!arg2) return message.channel.send('🙄 Provide a Minecraft player\'s username,, like `'+config.prefix+' mcskin notch`')
      message.channel.send('🔶 Getting **'+arg2+'** skin..,').then(m => setTimeout(() => m.delete(), 2000))
        axios.get('https://minecraft-api.com/api/skins/'+arg2+'/body/10.5/10/json')
        .then(res => {
            imgbb({
            	apiKey: process.env.IMGBB_API_KEY,
                name: arg2,
               	expiration: 3600,
               	base64string: !res.data.skin ? 'https://www.ssbwiki.com/images/0/05/Steve_Minecraft.png' : res.data.skin
            })
            .then(imgRes => { 
           		message.channel.send({ embeds: [new Discord.MessageEmbed() 
                    .setColor('#DD6E0F')
                    .setTitle(arg2)
                    .setImage(imgRes.url)
                ]})
            })
            
        }).catch(err => message.channel.send({content: '📛 Player API is experiencing errors, try again in 5 minutes oki! || '+err}))
    },

    achieve: message => {
        const args = message.content.slice(config.prefix.length+8).trim().split(/ +/g).join('..')
        axios.get('https://minecraft-api.com/api/achivements/cooked_salmon/achievement..got/'+args)
        .then(data => {
            message.channel.send({ embeds: [new Discord.MessageEmbed() 
                .setColor('#DD6E0F')
                .setImage(data.config.url)
            ]})
        })
    },

    ms: async (message, arg2) => {
        if (!arg2) return message.channel.send({content: '💢 Pls provide a Minecraft server bru'})
        var notCharacter = arg2.search(/[^\w.]/gm) == -1? true : false
        message.channel.send({content: '🕹 Getting server info, please wait..'}).then(m => setTimeout(() => m.delete(), 800))
        
		axios.get('https://eu.mc-api.net/v3/server/ping/' + arg2)
        .then(res => {
            const data = res.data
            if (!data.online) {
            message.channel.send({ embeds: [new Discord.MessageEmbed() 
            	.setColor('#DD6E0F')
            	.setTitle('\\🔴 '+arg2+' is offline')
                .setDescription('🔸 Make sure the address is an existing Minecraft server address, or let the server owner know!\n'+(notCharacter ? '🕐 Try again in 5 minutes!' :  '🔹 Did you mean: `'+arg2.replace(/[^\w.]/gm, '')+'`'))
            	.setTimestamp()
            ]})
            } else if (data.online) {
                const ping = data.took
                const players = data.players
                const sample = players.sample
                let ok = parseInt(ping)

                if (ok > 1000) ok = ping+'ms [WTF]'
                else if (ok > 399 && ok < 999) ok = ping+'ms [Bad]'
                else if (ok < 400 && ok > 149) ok = ping+'ms [avg]'
                else if (ok < 150 && ok > 24) ok = ping+'ms [OK]'
                else if (ok < 25) ok = ping+'ms [fast af]'

                message.channel.send({ embeds: [new Discord.MessageEmbed() 
                	.setColor('#DD6E0F')
                	.setTitle('\\🟢 '+arg2+' is online')
			           	.setDescription(data.description)
			           	.setThumbnail(data.favicon)
                	.addFields(
                    	{ name: '​', value: '**🔹 Info: **'+'\n'+
                      	'-------------------------------\n\n'+
			           	      '**Version**:  '+data.version.name+
                        '\n\n**Ping**:  '+ok+
                    	  '\n\n**Players in game:**  '+players.online+'/'+players.max+
                        (!sample[0]? '' : '\n • '+sample[0].name)+
                        (!sample[1]? '' : '\n • '+sample[1].name)+
                        (!sample[2]? '' : '\n • '+sample[2].name)+
                        (!sample[3]? '' : '\n • '+sample[3].name)+
                        (!sample[4]? '' : '\n • '+sample[4].name)+
                        '\n\n-------------------------------'+'\n🔸 This is a cached result. Please check again in '+data.cache.ttl+' seconds!'
                   		}
                  )
                  .setTimestamp()
                ]}) 
        	}
      	})
		.catch(err => message.channel.send({content: 'API error, pls wait for 5 minutes before trying again. | '+err}))
    }
}