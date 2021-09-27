const Discord = require('discord.js')
const axios = require('axios')

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
    }
}

module.exports = commands