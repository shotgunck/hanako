


// Not yet implemented
const Discord = require('discord.js')
const request = require('request')

const dotenv = require('dotenv')
dotenv.config()

const compiler = require('jdoodlecoderunner')

const commands = {
    compile: async (message, arg2) => {
        let args = message.content.substring(2).split(" ");
        var program = {
            script : "",
            language: "lua",
            versionIndex: "0",
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_ID
        }
        request({
            url: 'https://api.jdoodle.com/v1/execute',
            method: "POST",
            json: program
        },
        function (error, response, body) {
            console.log('error:', error)
            console.log('statusCode:', response && response.statusCode)
            console.log('body:', body)
        })
    }
}

module.exports = commands