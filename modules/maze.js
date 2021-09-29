


const commands = {
  maze: async(message) => {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Up')
					.setStyle('PRIMARY'),
			)
    message.channel.send({ components: [row] })
  }
}

module.exports