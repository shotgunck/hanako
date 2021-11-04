const server = require('express')()

server.all('/', (_, res) => res.send('ight, hanako'))

module.exports = function () {
    server.listen(3000, ()=>{})
}