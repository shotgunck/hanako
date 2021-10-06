// Not yet implemented
const Discord = require('discord.js')
const request = require('request')
const hastebin = require('hastebin-gen')
const htmlParser = require('html-to-json')

const dotenv = require('dotenv')
dotenv.config()

const config = require('../config.json')

const commands = {
    compile: async (message, arg2) => {
      console.log('source: ', arg2.replace(/```/g, '').replace(/^.+\n/, ''))
      console.log('lang: ', arg2.match(/\b\w+\b/g))

            var program = {
              script: arg2.replace(/```/g, '').replace(/^.+\n/, ''),
              language: arg2.match(/\b\w+\b/g)[0],
              versionIndex: "0",
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET
            }
            request
              .post({
                url: "https://api.jdoodle.com/execute",
                json: program,
              })
              .on("error", (error) => {
                console.log("request.post error", error);
                return;
              })
              .on("data", (data) => {
            const parsedData = JSON.parse(data.toString());
            if (parsedData.error) {
              console.log(parsedData.error)
              return;
            } else {
              var output = "";
              for (var i = 0; i < parsedData.output.length; i++) {
                if (parsedData.output[i] == "\n") output += "\n";
                else output += parsedData.output[i];
              }
              let outputOfProgram = new Discord.MessageEmbed()
                .setDescription("Result!!!")
                .setColor("33FFB3")
                .setDescription(output);
              message.channel.send(outputOfProgram);
              return;
            }
          })
    },
    cbt: async (message) => {
try {
      let args = message.content.substring(config.prefix.length).split(" ");
      switch (args[2]) {
        case "run":
      var language, index;
      if (args[3] == "C" || args[3] == "c") {
        language = "c";
        index = "0";
      } else if (args[3] == "python") {
        language = "python3";
        index = "3";
      }
      var fileName = message.attachments.array()[0];
      request.get(fileName.url, (err, response, body) => {
        console.log(body)
        const runRequestBody = {
          script: body,
          language: language,
          //stdin: input,
          versionIndex: index,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
        };
        request
          .post({
            url: "https://api.jdoodle.com/execute",
            json: runRequestBody,
          })
          .on("error", (error) => {
            console.log("request.post error", error);
            return;
          })
          .on("data", (data) => {
            console.log(data)
            const parsedData = JSON.parse(data.toString());
            if (parsedData.error) {
              return;
            } else {
              var output = "";
              for (var i = 0; i < parsedData.output.length; i++) {
                if (parsedData.output[i] == "\n") output += "\n";
                else output += parsedData.output[i];
              }
              let outputOfProgram = new Discord.MessageEmbed()
                .setDescription("Result!!!")
                .setColor("33FFB3")
                .setDescription(output);
              message.channel.send(outputOfProgram);
              return;
            }
          });
      });
      break;
    }
}
catch (Exception) {
    console.log(Exception);
    let Errorbotembed = new Discord.MessageEmbed()
      .setDescription("Error!!!")
      .setColor("FFFFFF")
      .setDescription("Error Encountered\nFor Help use\nDM help");
    message.channel.send(Errorbotembed);
  }
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