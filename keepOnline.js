


const express = require('express')
const server = express()

server.all('/', (_, res)=>{
    res.send('oui, bot is alive')
})

function keepAlive(){
    server.listen(3000, ()=>{})
}

module.exports = keepAlive
