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
        message.channel.send('Fetching, please wait...')
        axios.get('https://api.mcsrvstat.us/2/'+arg2)
        .then(res => {
            const data = res.data
            if (data.online === false) {
              message.channel.send({ embed: new Discord.MessageEmbed() 
               .setColor('#00DFFF')
               .setTitle('🔴 '+arg2+' is offline, try again latur kk')
               .setTimestamp()
              })
            } else if (data.online === true) {
                imgbb({
                  apiKey: process.env.IMGBB_API_KEY,
                  name: "mcservericon",
                  expiration: 3600,
                  base64string: !data.icon ? 'https://i.imgur.com/cpfxvnE.png' : data.icon.substr(22, data.icon.length)
                  })
                .then(res => { 
                  message.channel.send({ embed: new Discord.MessageEmbed() 
                    .setColor('#00DFFF')
                    .setTitle('🟢 '+arg2+' is online')
				            .setDescription(data.motd.clean[0])
				            .setThumbnail(res.url)
                    .addFields(
                    { name: '​', value: '**🈷 Info: **'+'\n'+
                    '-------------------------------\n\n'+
				            '**Version**: '+data.version+
                    '\n**Players in game:** '+data.players.online+
 
                    '\n\n'+

                    '-------------------------------'
                    })
                    .setTimestamp()
                    })
                })
                .catch(err => {
                    message.channel.send('Image API error, pls wait for 5 minutes before trying again.')       
                })
              
            }
      }).catch(err => {
        console.log(err)
        message.channel.send('API error, pls wait for 5 minutes before trying again.')
      })
    }
}

module.exports = commands

/*
{
	"online": true,
	"ip": "127.0.0.1",
	"port": 25567,
	"motd": {
		"raw": [
			"\u00a7cEver\u00a7r\u00a79PvP \u00a7r\u00a77- \u00a7r\u00a72\u00c9n server, for alle",
			"\u00a7r\u00a7fSe dine stats p\u00e5 \u00a7r\u00a76stats.everpvp.dk\u00a7r"
		],
		"clean": [
			"EverPvP - \u00c9n server, for alle",
			"Se dine stats p\u00e5 stats.everpvp.dk"
		],
		"html": [
			"<span style=\"color: #FF5555\">Ever<\/span><span style=\"color: #5555FF\">PvP <\/span><span style=\"color: #AAAAAA\">- <\/span><span style=\"color: #00AA00\">\u00c9n server, for alle<\/span>",
			"<span style=\"color: #FFFFFF\">Se dine stats p\u00e5 <\/span><span style=\"color: #FFAA00\">stats.everpvp.dk<\/span>"
		]
	},
	"players": {
		"online": 2,
		"max": 100,
		"list": [ //Only included when there are any players
			"Spirit55555",
			"sarsum33"
		],
		"uuid": { //Only included when ping is used and players are returned (may not contain all players)
			"Spirit55555": "f6792ad3-cbb4-4596-8296-749ee4158f97",
			"sarsum33": "d3512599-d4d9-4520-808f-a81f4cdfe8d0"
		}
	},
	"version": "1.12", //Could include multiple versions or additional text
	"protocol": 332, //Only included when ping is used, see more here: http://wiki.vg/Protocol_version_numbers
	"hostname": "server.mymcserver.tld", //Only included when a hostname is detected
	"icon": "data:image\/png;base64,iVBORw0KGgoAAAANSUhEU...dSk6AAAAAElFTkSuQmCC", //Only included when an icon is detected
	"software": "BungeeCord", //Only included when software is detected
	"map": "MyMcWorld",
	"plugins": { //Only included when plugins are detected
		"names": [
			"WordEdit",
			"WorldGuard"
		],
		"raw": [
			"WordEdit 6.1.5",
			"WorldGuard 6.2"
		]
	},
	"mods": { //Only included when mods are detected
		"names": [
			"BiomesOPlenty",
			"MoreFurnaces"
		],
		"raw": [
			"BiomesOPlenty 2.1.0",
			"MoreFurnaces 1.3.9"
		]
	},
	"info": { //Only included when detecting that the player samples are used for information
		"raw": [
			"\u00a77\u00bb \u00a7cKitPvP \u00a77:: \u00a7f1 \u00a77online",
			"\u00a77\u00bb \u00a7bSurvivalGames \u00a77:: \u00a7f0 \u00a77online"
		],
		"clean": [
			"\u00bb KitPvP :: 1 online",
			"\u00bb SurvivalGames :: 0 online"
		],
		"html": [
			"<span style=\"color: #AAAAAA\">\u00bb <\/span><span style=\"color: #FF5555\">KitPvP <\/span><span style=\"color: #AAAAAA\">:: <\/span><span style=\"color: #FFFFFF\">1 <\/span><span style=\"color: #AAAAAA\">online<\/span>",
			"<span style=\"color: #AAAAAA\">\u00bb <\/span><span style=\"color: #55FFFF\">SurvivalGames <\/span><span style=\"color: #AAAAAA\">:: <\/span><span style=\"color: #FFFFFF\">0 <\/span><span style=\"color: #AAAAAA\">online<\/span>"
		]
	}
}
*/