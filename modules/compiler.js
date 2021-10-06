// Might need cleanup
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
      if (!arg2 || arg2.startsWith('```') || !langVersion[arg2] ) {
        return message.channel.send('📜❌ Pls state a valid lang! The following syntax are valid: `c | cpp | csharp | objc | java | nodejs | lua | rust | python3 | ruby | brainfuck | go | swift | perl | php | sql | bash`\n\n'+'**Example:**\noi compile lua \\```lua'+
          '\nprint(\'comg\')\n'+
        '\\```'
        )
      }

      const source = message.content.substr(config.prefix.length + 9 + arg2.length, message.content.length)

      const program = {
        script: source.replace(/^.+\n/g, '').replace(/```/, ''),
        language: arg2,
        versionIndex: langVersion[arg2],
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
      }
      const before = Date.now()
      
      request.post({
        url: "https://api.jdoodle.com/v1/execute",
        json: program,
      })
      .on("error", reqErr => {
        message.channel.send('Executing error encountered:', reqErr)
      })
      .on("data", data => {
        let parsedData
        try {
          parsedData = JSON.parse(data.toString())
        } catch(err) {
          parsedData = {
            output: "💠 **Output formatting error, the raw output of the program will be displayed:** \n\n"+data.toString()
          }
        }
        if (parsedData.error) {
          message.channel.send('Parsing error encountered:', parsedData.error)
        } else {
          message.channel.send(new Discord.MessageEmbed()
            .setTitle("**__Output:__**")
            .setColor("33FFB3")
            .setDescription(parsedData.output === 'Unable to execute, please check your program and try again later, or contact JDoodle Support at jdoodle@nutpan.com.'? '❌ I can not compile the given code due to non-supportive packages/libraries,,': parsedData.output)
            .setFooter('Finished in: '+(Date.now() - before).toString()+'ms')
            .setTimestamp()
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