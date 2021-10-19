const Discord = require('discord.js')
const axios = require('axios')
const imgbb = require('imgbb-uploader')

const dotenv = require('dotenv')
dotenv.config()

const config = require('../config.json')

module.exports = {
    mcskin: (message, arg2) => {
      if (!arg2) return message.channel.send('🙄 Provide a Minecraft player\'s username,, like `'+config.prefix+' mcskin notch`')
      message.channel.send('🔶 Getting **'+arg2+'** skin..,').then(m => m.delete({timeout: 2000}))
        axios.get('https://minecraft-api.com/api/skins/'+arg2+'/body/10.5/10/json')
        .then(res => {
            imgbb({
            	apiKey: process.env.IMGBB_API_KEY,
                name: arg2,
               	expiration: 3600,
               	base64string: !res.data.skin ? 'https://www.ssbwiki.com/images/0/05/Steve_Minecraft.png' : res.data.skin
            })
            .then(imgRes => { 
           		message.channel.send({ embed: new Discord.MessageEmbed() 
                    .setColor('#DD6E0F')
                    .setTitle(arg2)
                    .setImage(imgRes.url)
                })
            })
            
        }).catch(err => message.channel.send('📛 Player API is experiencing errors, try again in 5 minutes oki! || '+err))
    },

    achieve: message => {
        const args = message.content.slice(config.prefix.length+8).trim().split(/ +/g).join('..')
        axios.get('https://minecraft-api.com/api/achivements/cooked_salmon/achievement..got/'+args)
        .then(data => {
            message.channel.send({ embed: new Discord.MessageEmbed() 
                .setColor('#DD6E0F')
                .setImage(data.config.url)
            })
        })
    },

    ms: async (message, arg2) => {
        if (!arg2) return message.channel.send('💢 Pls provide a Minecraft server bru')

        message.channel.send('Fetching, please wait...').then(msg => msg.delete({timeout: 2500}))
        
		axios.get('https://mcapi.us/server/status?ip='+arg2)
        .then(res => {
            const data = res.data
            if (data.online === false) {
            message.channel.send({ embed: new Discord.MessageEmbed() 
            	.setColor('#DD6E0F')
            	.setTitle('\\🔴 '+arg2+' is offline, try again in 5 minutes!')
                .setDescription('🔸 Make sure the address is a Minecraft server address and it\'s really exist!')
            	.setTimestamp()
            })
            } else if (data.online === true) {
               	imgbb({
               		apiKey: process.env.IMGBB_API_KEY,
               		name: "mcservericon",
               		expiration: 3600,
               		base64string: !data.favicon ? 'https://i.imgur.com/cpfxvnE.png' : data.favicon.substr(22, data.favicon.length)
               	})
              	.then(imgRes => { 
               		const ping = data.duration / 1000000
                    const players = data.players
                    const sample = players.sample
                    let ok = parseInt(ping)

                    if (ok > 499) ok = ping+'ms [Bad]'
                    else if (ok < 500 && ok > 149) ok = ping+'ms [avg]'
                    else if (ok < 150) ok = ping+'ms [OK]'

                   	message.channel.send({ embed: new Discord.MessageEmbed() 
                    	.setColor('#DD6E0F')
                    	.setTitle('\\🟢 '+arg2+' is online')
			           	.setDescription(data.motd)
			           	.setThumbnail(imgRes.url)
                    	.addFields(
                    	{ name: '​', value: '**🔹 Info: **'+'\n'+
                    	'-------------------------------\n\n'+
			           	'**Version**:  '+data.server.name+
                        '\n\n**Ping**:  '+ok+
                    	'\n\n**Players in game:**  '+players.now+'/'+players.max+
                        (!sample[0]? '' : '\n • '+sample[0].name)+
                        (!sample[1]? '' : '\n • '+sample[1].name)+
                        (!sample[2]? '' : '\n • '+sample[2].name)+
                        (!sample[3]? '' : '\n • '+sample[3].name)+
                        (!sample[4]? '' : '\n • '+sample[4].name)+
                        '\n\n-------------------------------'+
               		    '\n🔸 If u see info being displayed wrongly, try again in 5 minutes!'
                   		})
                   		.setTimestamp()
                   	}) 
                })
            	.catch(err => message.channel.send('Image API error, pls wait for 5 minutes before trying again. | '+err))
        	}
      	})
		.catch(err => message.channel.send('API error, pls wait for 5 minutes before trying again. | '+err))
    }
}