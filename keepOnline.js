const express = require('express')
const server = express()

server.all('/', (_, res) => {
    res.send('ight, hanako')
})

function keepAlive() {
    server.listen(3000, ()=>{})
}

module.exports = keepAlive
