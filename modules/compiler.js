// Not yet implemented
const request = require('request')
const hastebin = require('hastebin-gen')

const dotenv = require('dotenv')
dotenv.config()

const commands = {
    compile: async (message, arg2) => {
        hastebin(arg2.replace(/```/g, '').replace(/^.+\n/, ''), arg2.replace(/```/g, ''))
        .then(function(res) {
          console.log(res.split('\n')[0])
          var program = {
            script : res.split('\n')[0],
            language: message.content.replace(/oi compile ```/g, ''),
            versionIndex: "2",
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        }
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
        })
    }
}

module.exports = commands