

const Discord = require("discord.js")

const chessState = require('./chessBoard.js')

const { parseChessMove, parseChessCoord } = require('./util.js')
const { pieces } = require('./images.js')

const commandPrefix = 'c!'
const piecesWithNone = pieces.concat('none')

const commands = {
    new: message => {
      if (chessState.board) {
        return message.reply('There\'s a match going on bru, spectate them')
      }

      message.channel.send('\\♟ Oki click ♟ to start. You have `10 seconds` to react.').then(m => m.delete({timeout: 10001}))

      message.react('♟')
      
      message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '♟'),
        { max: 1, time: 10000 }).then(collected => {
          if (collected.first().emoji.name == '♟') {
            chessState.newBoard()
            chessState.sendBoardImage(message, '**Match: **'+message.content.split(' ')[2]+' [light] __vs__ '+message.content.split(' ')[3]+' [dark]')
            chessState.saveBoard()
            message.reactions.removeAll()
          }
          }).catch(() => {
            message.channel.send('k no chess then,, cringj').then(m => m.delete({timeout: 5000}))
          });   
    },
  
    end: message => {
      chessState.board = null
      message.channel.send("\\♟ Match ended by **"+message.author.username+"**. Latest result can be observed from the latest board image!")
    },

    help: message => {
      const chessHelp = new Discord.MessageEmbed()
	      .setColor('#00DFFF')
	      .setTitle('nigloo chess')
        .setThumbnail('https://i.imgur.com/XZMFwU1.png')
	      .addFields(
		{ name: '​', value: '♟ **Prefix:** `c!`\n----------------------------------------\n\n'+
    '**c! help** - Show this message\n'+
    '**c! new [who] [who]** - New match, who vs who\n'+
    '**c! ax by** - Move the piece at position `ax` to position `by`\n'+
    '**c! end** - End the current match\n\n'+
    '----------------------------------------\n' },
 
    )
	  .setTimestamp()
	  .setFooter('♟ chess against gato?');

    message.channel.send({ embed: chessHelp });
    },

    move: async message => {
      if (!chessState.board) return message.channel.send('\\♟ Start a match first plss')
  
        const msgNoPrefix = message.content.replace(commandPrefix, '')
        const fromTo = message.content.split(' ')
        const chessMove = parseChessMove(msgNoPrefix)
        const { board } = chessState

        if (!chessMove) {
            message.channel.send('Syntax error: `ax by` with `a, b` range from a-h, `x, y` range from 1-8. Type again!')
        } else if (board[chessMove.from.y][chessMove.from.x]) {
            const targetPiece = board[chessMove.from.y][chessMove.from.x]
            board[chessMove.to.y][chessMove.to.x] = targetPiece
            board[chessMove.from.y][chessMove.from.x] = undefined

            await chessState.sendBoardImage(message, '**'+ message.author.username+': '+ fromTo[1]+' to '+fromTo[2]+'**')
            chessState.saveBoard()

            let w, b
            for (row of board) {
                w = (row.find(p => p === 'wking')) ? true : false
                b = (row.find(p => p === 'bking')) ? true : false
            }
            if (w === false) {
              return message.channel.send('Light queen isn\'t on board anymore,,, I think dark won!')
            } else if (b === false) {
              return message.channel.send('Dark queen isn\'t on board anymore,,, I think light won!')
            }

            if ((chessMove.to.y === 0 || chessMove.to.y === 7) && targetPiece.includes('pawn')) {
                message.channel.send(`You can upgrade that pawn now! For example: ` +
                    `\`${commandPrefix}set b8 wqueen\`. The valid piece names are: ` +
                    `\`${piecesWithNone.join(', ')}\``)
            }

        } else {
            message.channel.send('`'+fromTo[1]+'` has no pieces, pls move another!')
        }
    },

    set: (message, msgParts) => {
        if (msgParts[3]) {
            const coord = parseChessCoord(msgParts[2])
            if (coord && piecesWithNone.includes(msgParts[3])) {
                const target = msgParts[3] === 'none' ? undefined : msgParts[3]
                chessState.board[coord.y][coord.x] = target
                chessState.sendBoardImage(message, `set ${msgParts[2]} to ${msgParts[3]}`)
                chessState.saveBoard()
                return
            }
        }
        message.channel.send(`Oui invalid command,, valid command looks like: \`${commandPrefix}set b8 wqueen\`` +
            `. The valid piece names are: \`${piecesWithNone.join(', ')}\``);
    }
};

module.exports = commands
