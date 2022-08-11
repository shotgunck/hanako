const { EmbedBuilder } = require('discord.js')

const chessState = require('../chess/chessBoard')
const { parseChessMove, parseChessCoord } = require('../chess/util')
const { pieces } = require('../chess/images')

const commandPrefix = 'c!'
const piecesWithNone = pieces.concat('none')

const { msgDelete } = require('../helper')

module.exports = {
  new(message) {
    if (chessState.board) return message.reply('There\'s a match going on bru, spectate them')

    message.channel.send('♟ Oki type `yes chess` to start. You have `10 seconds` to chat.').then(m => msgDelete(m, 8))

    const filter = m => m.content.startsWith('yes chess')
    message.channel.awaitMessages({ filter, max: 1, time: 10_000, errors: ['time'] })
      .then(_ => {
        const player = message.content.split(' ')

        chessState.newBoard()
        chessState.sendBoardImage(message, `**Match: **${player[2]} [light] __vs__ ${player[3]} [dark]`)
        chessState.saveBoard()
      })
  },

  end(message) {
    chessState.board = null
    message.channel.send(`♟ Match ended by **${message.author.username}**. Latest result can be observed from the latest board image!`)
  },

  h(message) {
    message.channel.send({
      embeds: [new EmbedBuilder()
        .setColor('#DD6E0F')
        .setTitle('Chess')
        .setThumbnail('https://i.imgur.com/XZMFwU1.png')
        .addFields(
          {
            name: '​', value: '♟ **Prefix:** `c!`\n' + `
          ----------------------------------------
          **c! h** - Show this message
          **c! new [who] [who]** - New match, who vs who
          **c! ax by** - Move the piece at position`+ ' `ax` ' + 'to position' + ' `by`' + `
          **c! end** - End the current match
          ----------------------------------------` },
        )
        .setTimestamp()
      ]
    })
  },

  async move(message) {
    if (!chessState.chessboard) return message.channel.send('♟ Start a match first pls')

    let content = message.content
    let msgNoPrefix = content.replace(commandPrefix, '')
    let fromTo = content.split(' ')
    let chessMove = parseChessMove(msgNoPrefix)
    let { chessboard } = chessState

    if (!chessMove) message.channel.send('Syntax error: `ax by` with `a, b` range from a-h, `x, y` range from 1-8. Type again!').then(m => msgDelete(m, 7))
    else if (chessboard[chessMove.from.y][chessMove.from.x]) {
      const targetPiece = chessboard[chessMove.from.y][chessMove.from.x]
      chessboard[chessMove.to.y][chessMove.to.x] = targetPiece
      chessboard[chessMove.from.y][chessMove.from.x] = undefined

      await chessState.sendBoardImage(message, `**${message.author.username}: ${fromTo[1]} to ${fromTo[2]}**`)
      chessState.saveBoard()

      let lk = false, dk = false

      for (row of chessboard) {
        if (row.find(p => p === 'wking')) lk = true
        else if (row.find(p => p === 'bking')) dk = true
      }

      if (!lk) return message.channel.send(`Light king isn't on board anymore... I think dark won!`)
      else if (!dk) return message.channel.send(`Dark king isn't on board anymore... I think light won!`)

      if ((chessMove.to.y === 0 || chessMove.to.y === 7) && targetPiece.includes('pawn')) message.channel.send(`You can upgrade that pawn now! For example: ` +
        `\`${commandPrefix}set b8 wqueen\`. The valid piece names are: ` +
        `\`${piecesWithNone.join(', ')}\``
      )
    }
    else message.channel.send(`\`${fromTo[1]}\` has no pieces, pls move another!`)
  },

  set(message, msgParts) {
    if (msgParts[3]) {
      const coord = parseChessCoord(msgParts[2])
      if (coord && piecesWithNone.includes(msgParts[3])) {
        const target = msgParts[3] === 'none' ? undefined : msgParts[3]
        chessState.chessboard[coord.y][coord.x] = target
        chessState.sendBoardImage(message, `set ${msgParts[2]} to ${msgParts[3]}`)
        chessState.saveBoard()
        return
      }
    }
    message.channel.send(`Invalid command,, valid command looks like: \`${commandPrefix}set b8 wqueen\`` +
      `. The valid piece names are: \`${piecesWithNone.join(', ')}\``)
  }
}
