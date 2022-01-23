const { MessageAttachment } = require('discord.js')

const fs = require('fs')
const nodeCanvas =  require('canvas')

const { images } = require('./images')

let chessboard

const newBoard = () => {
    let board = []
    const presetRows = {
        0: ['brook', 'bknight', 'bbishop', 'bqueen', 'bking', 'bbishop', 'bknight', 'brook'],
        1: ['bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn'],
        6: ['wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn'],
        7: ['wrook', 'wknight', 'wbishop', 'wqueen', 'wking', 'wbishop', 'wknight', 'wrook']
    }

    for (let y = 0; y < 8; y++) board.push(presetRows[y] || Array.from({ length: 8 }))

    chessmodule.chessboard = board
    return board
}

const renderBoard = async () => {
    const width = 280
    const height = 280
    const boardXOffset = 24
    const pieceSize = 32

    const canvas = nodeCanvas.createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(images.board, 0, 0)

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const image = images[chessboard[y][x]]
            if (image) ctx.drawImage(image, boardXOffset + pieceSize * x, pieceSize * y)
        }
    }

    const buf = canvas.toBuffer('image/png', { compressionLevel: 9 })
    const fileName = 'comg.png'
    await fs.writeFile(fileName, buf, function(_, _){})

    return fileName
};

const sendBoardImage = async (message, text) => {
  await renderBoard()
  message.channel.send({
    content: text,
    files: [new MessageAttachment('./comg.png')]
  })
}

const saveBoard = () => {
    const json = JSON.stringify(chessboard).replace(/],/g, '],\n').replace('[[', '[\n[').replace(']]', ']\n]')
    return fs.writeFile('state.json', json, function(_, _){})
}

const chessmodule = {
  chessboard,
  newBoard: () => {
    chessboard = newBoard()
  },
  sendBoardImage,
  saveBoard,
  loadBoard: async () => {
    if (fs.readFile('./state.json', 'utf8', function(_, _){})) chessboard = JSON.parse(data)
  }
}

module.exports = chessmodule