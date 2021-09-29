const Discord = require('discord.js')
const DiscordButton = require('discord-buttons')

const commands = {
  maze: async(message) => {
    let button = new DiscordButton.MessageButton()
        .setStyle('red')
        .setLabel('Up') 
        .setID('click_to_function') 
        .setDisabled()
    
    message.channel.send('sup babe', button);
  }
}

module.exports = commands