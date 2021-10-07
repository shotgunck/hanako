const fs = require('fs')
const nodeCanvas =  require('canvas')

const { makeSimpleErrorHandler } = require('./util.js')
const { images } = require('./images.js')

let board;

const newBoard = () => {
    const board = []
    const presetRows = {
        0: ['brook', 'bknight', 'bbishop', 'bqueen', 'bking', 'bbishop', 'bknight', 'brook'],
        1: ['bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn', 'bpawn'],
        6: ['wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn', 'wpawn'],
        7: ['wrook', 'wknight', 'wbishop', 'wqueen', 'wking', 'wbishop', 'wknight', 'wrook']
    }
    for (let y = 0; y < 8; y++) {
        board.push(presetRows[y] || Array.from({ length: 8 }))
    }
    return board
};

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
            const image = images[board[y][x]]
            if (image) {
                ctx.drawImage(image, boardXOffset + pieceSize * x, pieceSize * y)
            }
        }
    }

    const buf = canvas.toBuffer('image/png', { compressionLevel: 9 })
    const fileName = 'comg.png' //Date.now() + '.png';
    fs.writeFile(fileName, buf, function(err, result){})
    return fileName
};

const sendBoardImage = async (message, text) => {
  message.channel.send("[Rendering...]").then(m => m.delete({ timeout: 750 }))
  const boardImage = await renderBoard(board)
  await message.channel.send(text, {
    files: [{
      attachment: boardImage,
      name: boardImage
    }]
  }).catch(makeSimpleErrorHandler('Failed to send msg!'))
  //fs.unlink(boardImage, function(e, r){})
}

const saveBoard = () => {
    const json = JSON.stringify(board).replace(/],/g, '],\n').replace('[[', '[\n[').replace(']]', ']\n]')
    return fs.writeFile('state.json', json, function(_, _){})
}

module.exports = {
    board,
    newBoard: () => {
        board = newBoard()
        chessState.board = board
    },
    sendBoardImage,
    saveBoard,
    loadBoard: async () => {
        const data = fs.readFile('./state.json', 'utf8', function(_, _){})
        if (data) {
            board = JSON.parse(data)
            chessState.board = board
        }
    }
}