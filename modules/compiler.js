const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')
const axios = require('axios')

const { sendMessage, langVersion } = require('../helper')

const errorLog = `📜❌ Pls state a valid lang! The following syntax are valid: \`c | cpp | csharp | objc | java | nodejs | lua | rust | python3 | ruby | brainfuck | go | swift | perl | php | sql | clojure | coffeescript | elixir | lolcode | kotlin | groovy | octave\`
**Example:** oi compile lua \`\`\`lua
print('comg')
\`\`\``

module.exports = {
  compile: {
    slash: new SlashCommandBuilder()
      .setName('compile')
      .setDescription('Compile a code [!! Please use the oi compile command instead]')
      .addStringOption(option => option
        .setName('data')
        .setDescription('Format: [lang] + [code]')
        .setRequired(false))
      .toJSON(),

    args: 'data',

    async execute(message, arg2, main) {
      if (message.editReply) return message.reply('‼ Please use the `compile` command instead!')

      if (!arg2 || arg2.startsWith('```') || langVersion[arg2] === null) return message.channel.send(errorLog)
  
      let source = main.substr(8 + arg2.length, main.length)
  
      let program = {
        script: source.replace(/^.+\n/g, '').replace(/```/, ''),
        language: arg2,
        versionIndex: langVersion[arg2],
        clientId: process.env.JD_CLIENT_ID,
        clientSecret: process.env.JD_CLIENT_SECRET
      }
  
      axios.post('https://api.jdoodle.com/v1/execute', program).then(res => {
        let data = res.data
        let output = data.output
        
        message.reply({
          embeds: [new EmbedBuilder()
            .setTitle('**💠 Output:**')
            .setColor('#DD6E0F')
            .setDescription(output === 'Unable to execute, please check your program and try again later, or contact JDoodle Support at jdoodle@nutpan.com.' ? '❌ I can not compile the given code due to non-supportive packages/libraries!' : '```' + output + '```')
            .setFooter({text: `CPU time: ${data.cpuTime}ms | Memory used: ${data.memory}kb`})
            .setTimestamp()
          ],
          
          allowedMentions: { repliedUser: false }
        })
      }).catch(error => sendMessage(message, `${errorLog}\n\n${error}`))
    }
  }
}