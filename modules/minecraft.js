const Discord = require('discord.js')
const axios = require('axios')

let url = 'https://minecraft-api.com/api/skins/notsoclassy/body/10/10/10/25/12/json'

const commands = {
    mcskin: (message, arg2) {
        axios.get('https://minecraft-api.com/api/skins/'+arg2+'/body/10/10/10/25/12/json')
        .then(data => {
            console.log(data)
            message.channel.send({ embed: new Discord.MessageEmbed() 
            .setColor('#00DFFF')
            .setTitle(arg2)
            .setThumbnail(data)
            })
        })
    }
}

module.exports = commands