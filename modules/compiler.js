// Not yet implemented
const Discord = require('discord.js')
const request = require('request')

const dotenv = require('dotenv')
dotenv.config()

const config = require('../config.json')



const commands = {
    compile: async (message, arg2) => {
      const program = {
        script: arg2.replace(/```/g, '').replace(/^.+\n/, ''),
        language: arg2.match(/\b\w+\b/g)[0],
        versionIndex: "0",
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