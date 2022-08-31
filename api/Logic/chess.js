import { Chess } from 'chess.js'

const chess = new Chess()

export default class Game {
    constructor(firstPlayer, gameMode, idGame) {
        this.game = new Chess()
        this.firstPlayer = firstPlayer
        this.secondPlayer = null
        this.gameMode = gameMode
        this.idGame = idGame
        this.watchers = new Array(0)
    }
}

// chess.move('a4')
// chess.move('g6')
// chess.move('a5')
// chess.move('g5')
// chess.move('a6')
// chess.move('g4')
// chess.move('axb7')
// chess.move("g3")

// console.log(chess.moves());

// console.log(chess.pgn(), chess.board())