const Discord = require('discord.js')
const axios = require('axios')

const config = require('../config.json')

let prefix = config.prefix
const lock = true

const dotenv = require('dotenv')
dotenv.config()

const commands = {
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
            { name: '​', value: '🎵 **Current prefix:** '+prefix+'\n'+
            '-------------------------------\n\n'+
            '**help** - Show this messenge\n\n'+
            '**prefix** - Set a new prefix for me\n'+

            '**chess** - Info about chess\n'+
            '**compile** - Code compiler\n'+
            '**mcskin** - Show skin of a Minecraft player\n'+
            '**achieve** - Achievement got!\n'+
            '**ms** - Get a minecraft server\'s status\n'+
            '**gato** - Random gato picture\n\n'+

            '**filter** - Set a sound filter\n'+
            '**lyrics** - Display the current sound\'s lyrics\n'+
            '**play** - Play a sound or add into queue\n'+
            '**queue** - Show the current queue\n'+
            '**skip** - Skip to the next sound in queue\n'+
            '**stop** - Stop the playing sound\n'+
            '**volume** - Set the bot\'s volume\n\n'+
            '-------------------------------'
            },
            )
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
            message.client.user.setActivity(config.prefix+" help", { type: "LISTENING" });
        } else {
            message.channel.send("Current prefix: ``"+prefix+"``\nTo change prefix, type ``"+prefix+" prefix [new-prefix]``\n\n❗ In case you forgot what the prefix is,  see what I'm listening to!");
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
            message.channel.send({ embed: new Discord.MessageEmbed()
                .setColor('#DD6E0F')
                .setTitle('wa')
                .setImage(res.data.url)
            })
        })
    },

    '8ball': async(message) => {
      axios.get(process.env.S_API_B1)
        .then(res => message.channel.send(res.data[0].reply))
    }
}

module.exports = commands