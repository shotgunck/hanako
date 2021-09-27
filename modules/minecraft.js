const Discord = require('discord.js')
const axios = require('axios')

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
}

module.exports = commands