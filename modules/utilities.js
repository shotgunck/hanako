const Discord = require('discord.js')
const axios = require('axios')

const config = require('../config.json')

let prefix = config.prefix
const lock = false

const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    chess: async message => {
        message.channel.send('♟ Prefix for chess is specified as `c!`, type `c! help` for more ight')
    },
    
    help: async message => {
        message.channel.send({ embed: new Discord.MessageEmbed()
            .setColor('#DD6E0F')
            .setTitle('Hanako')
            .setAuthor('', 'https://i.imgur.com/RZKGQ7z.png')
            .setDescription('created by shotgun#4239, written in JS')
            .setThumbnail('https://i.imgur.com/RZKGQ7z.png')
            .addFields(
            { name: '​', value: '🎵 **Current prefix:** '+prefix+'\n'+`
            -------------------------------
            **help** - Show this messenge
            **prefix** - Set a new prefix for me

            **8ball** - Answer your questions [y/n]
            **chess** - Info about chess
            **compile** - Code compiler
            **mcskin** - Show skin of a Minecraft player
            **achieve** - Achievement got!
            **ms** - Get a Minecraft server's status
            **gato** - Random gato picture

            **filter** - Set a sound filter
            **lyrics** - Display the current sound's lyrics
            **play** - Play a sound or add into queue
            **pause/resume** - Pause/Resume the current queue (unstable)
            **queue** - Show the current queue
            **skip** - Skip to the next sound in queue
            **stop** - Stop the playing sound
            **volume** - Set the bot's volume
            -------------------------------
            `
            })
            .setTimestamp()
            .setFooter('ight have fun')
        })
    },
    
    prefix: async (message, arg2) => {
        if (arg2) {
            if (arg2 === 'c!') return message.channel.send('⚠♟ `c!` is preserved for chess game! Type `c! help` for more,.')
            
            config.prefix = arg2
            prefix = config.prefix

            message.channel.send("❗ My prefix is now changed to ``"+arg2+"``\n❗ In case you forgot what the prefix is, see what I'm listening to!")
            if (arg2 == 'default') {
                message.channel.send("⚠ Note: it will literally be ``default``, **__not__** ``oi``.")
            }
            message.client.user.setActivity(prefix+" help", { type: "LISTENING" })
        } else {
            message.channel.send("Current prefix: ``"+prefix+"``\nTo change prefix, type ``"+prefix+" prefix [new-prefix]``\n\n❗ In case you forgot what the prefix is,  see what I'm listening to!")
        }
    },

    gato: async(message) => {
        axios.get('https://aws.random.cat/meow?ref=apilist.fun')
        .then(res => {
            message.channel.send({ embed: new Discord.MessageEmbed()
                .setColor('#DD6E0F')
                .setTitle('gato')
                .setImage(res.data.file)
            })
        })
    },

    wa: async(message) => {
      if (lock === true) return message.channel.send('noj,,,')
      axios.get('https://api.waifu.pics/sfw/waifu')
        .then(res => {
            if (message.channel.nsfw) {
              message.channel.send({ embed: new Discord.MessageEmbed()
                .setColor('#DD6E0F')
                .setTitle('wa')
                .setImage(res.data.url)
              })
            } else {
              message.channel.send('Oui, nsfw channel only!')
            }
        })
    },

    '8ball': async(message) => {
      axios.get(process.env.S_API_B1)
        .then(res => message.channel.send(res.data[0].reply))
    }
}