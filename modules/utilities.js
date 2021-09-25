


const Discord = require('discord.js')

const config = require('../config.json')

let prefix = config.prefix

const commands = {
    chess: async message => {
        message.channel.send('\\♟ Prefix for chess is specified as `c!`, type `c! help` for more ight')
    },
    
    help: async message => {
        message.channel.send({ embed: new Discord.MessageEmbed()
            .setColor('#00DFFF')
            .setTitle('nigloo bot')
            .setAuthor('', 'https://i.imgur.com/j0CgA16.png')
            .setDescription('created by shotgun#4239, written in JS')
            .setThumbnail('https://i.imgur.com/j0CgA16.png')
            .addFields(
            { name: '​', value: '🎵 **Current prefix:** '+prefix+'\n'+
            '-------------------------------\n\n'+
            '**chess** - Info about chess\n'+
            '**help** - Show this messenge\n'+
            '**prefix** - Set a new prefix for me\n'+
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

            message.channel.send("❗ My prefix is now changed to ``"+arg2+"``\n**❗ In case you forgot what the prefix is, see what I'm listening to!")
            if (arg2 == 'default') {
                message.channel.send("⚠ Note: it will literally be ``default``, **__not__** ``oi``.")
            }
            message.client.user.setActivity(config.prefix+" help", { type: "LISTENING" });
        } else {
            message.channel.send("Current prefix: ``"+prefix+"``\nTo change prefix, type ``"+prefix+" prefix [new-prefix]``\n\n**❗ In case you forgot what the prefix is,  see what I'm listening to!");
        }
    }
}

module.exports = commands