// Not yet implemented
const Discord = require('discord.js')
const request = require('request')

const dotenv = require('dotenv')
dotenv.config()

const config = require('../config.json')

const langVersion = {
  java: 3,
  c: 4,
  cpp: 4,
  php: 3,
  perl: 3,
  python3: 3,
  ruby: 3,
  go: 3,
  bash: 3,
  sql: 3,
  csharp: 3,
  objc: 3,
  swift: 3,
  brainfuck: 0,
  lua: 2,
  rust: 3,
  nodejs: 3,
}

const commands = {
    compile: async (message, arg2) => {
      if (!arg2 || arg2.startsWith('```')) {
        return message.channel.send('📜❌ Pls state a valid lang! The following syntax are valid: `c | cpp | csharp | objc | java | nodejs | lua | rust | python3 | ruby | brainfuck | go | swift | perl | php | sql | bash`\n\n'+'**Example:**\noi compile lua \\```lua'+
          '\nprint(\'comg\')\n'+
        '\\```'
        )
      }

      const subcontents = message.content.split(' ')
      const cmd = message.content.slice(config.prefix.length).trim().split(/ +/g).shift().toLowerCase()
      const arg3 = cmd === subcontents[1] ? subcontents[3] : subcontents[2]
      if (!langVersion[arg2]) return message.channel.send('need real lang')
      const program = {
        script: arg3.replace(/```/g, '').replace(/^.+\n/, ''),
        language: arg2,
        versionIndex: langVersion[arg2],
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
      }
      request.post({
        url: "https://api.jdoodle.com/execute",
        json: program,
      })
      .on("error", err => {
        message.channel.send('Executing error encountered:', error)
      })
      .on("data", data => {
        const parsedData = JSON.parse(data.toString())
        if (parsedData.error) {
          message.channel.send('Parsing error encountered:', parsedData.error)
        } else {
          let output = ''
          for (var i = 0; i < parsedData.output.length; i++) {
            if (parsedData.output[i] == "\n") output += "\n"
            else output += parsedData.output[i]
          }
          message.channel.send(new Discord.MessageEmbed()
            .setTitle("**__Output:__**")
            .setColor("33FFB3")
            .setDescription(output)
          )
        }
      })
    }
}

module.exports = commands

/*
request({
              url: 'https://api.jdoodle.com/execute',
              method: "POST",
              json: program
            },
            function (error, response, body) {
              console.log('error:', error)
              console.log('statusCode:', response && response.statusCode)
              console.log('body:', body)
            })
            */