const Discord = require('discord.js')
const axios = require('axios')
const imgbb = require('imgbb-uploader')

const dotenv = require('dotenv')
dotenv.config()

const config = require('../config.json')

const commands = {
    mcskin: (message, arg2) => {
        axios.get('https://www.mc-heads.net/body/'+arg2+'/270')
        .then(data => {
            message.channel.send({ embed: new Discord.MessageEmbed() 
            .setColor('#00DFFF')
            .setTitle(arg2)
            .setImage(data.config.url)
            })
        })
    },

    achieve: message => {
        const args = message.content.slice(config.prefix.length+8).trim().split(/ +/g).join('..')
        axios.get('https://minecraft-api.com/api/achivements/cooked_salmon/achievement..got/'+args)
        .then(data => {
            message.channel.send({ embed: new Discord.MessageEmbed() 
            .setColor('#00DFFF')
            .setImage(data.config.url)
            })
        })
    },

    ms: async (message, arg2) => {
        message.channel.send('Fetching, please wait...').then(msg => msg.delete({timeout: 2000}))
        
		axios.get('https://api.mcsrvstat.us/2/'+arg2)
        .then(res => {
            const data = res.data
            if (data.online === false) {
            message.channel.send({ embed: new Discord.MessageEmbed() 
            	.setColor('#00DFFF')
            	.setTitle('\\🔴 '+arg2+' is offline, try again latur kk')
            	.setTimestamp()
            })
            } else if (data.online === true) {
               	imgbb({
               		apiKey: process.env.IMGBB_API_KEY,
               		name: "mcservericon",
               		expiration: 3600,
               		base64string: !data.icon ? 'https://i.imgur.com/cpfxvnE.png' : data.icon.substr(22, data.icon.length)
               	})
              	.then(imgRes => { 
               		axios.get('https://minecraft-api.com/api/ping/response/'+data.hostname+'/'+data.port+'/json')
               			.then(pingRes => {
                   			const ping = pingRes.data.response
                        let ok = parseInt(ping)

                        if (ok > 89) ok = ping+' [OK]'
                        else if (ok < 90 && ok > 49) ok = ping+' [Avg]'
                        else if (ok < 50) ok = ping+' [Bad]'

                   			message.channel.send({ embed: new Discord.MessageEmbed() 
                     			.setColor('#00DFFF')
                      			.setTitle('\\🟢 '+arg2+' is online')
			                	.setDescription(data.motd.clean[0])
			                	.setThumbnail(imgRes.url)
                       			.addFields(
                       			{ name: '​', value: '**\\➕ Info: **'+'\n'+
                       			'-------------------------------\n\n'+
			                	'**Version**: '+data.version+
                       			'\n**Players in game:** '+data.players.online+
                       			'\n**Ping**: '+ok+
                   				'\n\n'+
			                    '-------------------------------'+
               				    '\n🔹 If u see info being displayed wrongly, try again in 5 minutes!'
                   				})
                   				.setTimestamp()
                   			})
              			})      
                })
            	.catch(err => message.channel.send('Image API error, pls wait for 5 minutes before trying again.'))
        	}
      	})
		.catch(err => {
        	console.log(err)
        	message.channel.send('API error, pls wait for 5 minutes before trying again.')
      	})
    }
}

module.exports = commands