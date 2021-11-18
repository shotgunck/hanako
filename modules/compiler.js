const Discord = require('discord.js')
const axios = require('axios')

require('dotenv').config()

const config = require('../config.json')

const langVersion = {
  java: 3, c: 4, cpp: 4, php: 3, perl: 3, python3: 3, ruby: 3, go: 3, clojure: 2, sql: 3, csharp: 3, objc: 3, swift: 3, brainfuck: 0, lua: 2, rust: 3, nodejs: 3, coffeescript: 3, elixir: 3, lolcode: 0, kotlin: 2, groovy: 3, octave: 3
}

const errorLog = '📜❌ Pls state a valid lang! The following syntax are valid: `c | cpp | csharp | objc | java | nodejs | lua | rust | python3 | ruby | brainfuck | go | swift | perl | php | sql | clojure | coffeescript | elixir | lolcode | kotlin | groovy | octave`\n\n'+'**Example:**\noi compile lua \\```lua'+
          '\nprint(\'comg\')\n'+
        '\\```'

module.exports = {
  compile: async (message, arg2) => {
    if (!arg2 || arg2.startsWith('```') || langVersion[arg2] === null ) return message.channel.send({content: errorLog})

    const source = message.content.substr(config.prefix.length + 9 + arg2.length, message.content.length)

    const program = {
      script: source.replace(/^.+\n/g, '').replace(/```/, ''),
      language: arg2,
      versionIndex: langVersion[arg2],
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    }
    const before = Date.now()
    axios.post('https://api.jdoodle.com/v1/execute', program)
      .then(res => {
        const output = res.data.output
        message.channel.send({embeds: [new Discord.MessageEmbed()
          .setTitle("**💠 Output:**")
          .setColor("#DD6E0F")
          .setDescription(output === 'Unable to execute, please check your program and try again later, or contact JDoodle Support at jdoodle@nutpan.com.'? '❌ I can not compile the given code due to non-supportive packages/libraries,,': output)
          .setFooter('Finished in: '+(Date.now() - before).toString()+'ms')
          .setTimestamp()
        ]})
      })
      .catch(error => message.channel.send({content: errorLog+'\n\n'+error}))
  }
}