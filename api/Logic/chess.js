import { Chess } from 'chess.js'

export default class Game {
    constructor(firstPlayer, gameMode, idGame) {
        this.game = new Chess()
        this.firstPlayer = firstPlayer
        this.secondPlayer = null
        this.gameMode = gameMode
        this.idGame = idGame
        this.watchers = new Array(0)
        this.selectedPiece = null
        this.waitingPromotion = null
    }

    getPiece(indexClick) {
        const allPieces = this.game.board()
        return allPieces[parseInt(indexClick / 8)][indexClick % 8];
    }

    transformIndexInSquare(index) {
        return String.fromCharCode(97 + index % 8) + (8 - parseInt(index / 8))
    }

    transformSquareInIndex(square) {
        let rockSquare = []
        if(square.includes('O-O')) rockSquare.push(square.includes('Kf1') ? 62 : 6)
        if(square.includes('O-O-O')) rockSquare.push(square.includes('Kd1') ? 58 : 2)

        for(let i = 0; i < square.length; i++) {
            square[i] = square[i].split("=")[0]
            const numberCase = square[i].charAt(square[i].length - 1)
            let letterCase = square[i].charAt(square[i].length - 2)
            letterCase = (letterCase.charCodeAt(0) - 97)
            square[i] = letterCase + (8 - numberCase) * 8
        }
        return square.concat(rockSquare)
    }

    isPromoAllowed(indexClick) {
        const arrivingSquare = this.transformIndexInSquare(indexClick)
        const possibleMove = this.game.moves({ square: this.transformIndexInSquare(this.selectedPiece) })
        for (const move of possibleMove) {
            if(move.split("=")[0].substring(move.split("=")[0].length - 2) === arrivingSquare) {
                this.waitingPromotion = indexClick
                return true
            }
        }   
        this.selectedPiece = false
        return false
    }

    movePiece(indexClick) {
        const possibleMove = this.game.moves({ square: this.transformIndexInSquare(this.selectedPiece) })
        for (const moves of possibleMove) {
            if(moves.includes("=")) return false
        }

        this.game.move({ from: this.transformIndexInSquare(this.selectedPiece), to: this.transformIndexInSquare(indexClick) })
        this.selectedPiece = null
        
        return { map: this.getMap(this.game.board()), pgn: this.game.pgn() }
    }

    getPossibleMove(indexClick) {
        const square = this.transformIndexInSquare(indexClick)
        return this.transformSquareInIndex(this.game.moves({ square }))
    }

    createPromotion(choice) {
        this.game.move(this.createPromotionMove(choice))
        this.selectedPiece = null
        this.waitingPromotion = null
        return { map: this.getMap(this.game.board()), pgn: this.game.pgn() }
    }

    createPromotionMove(choice) {
        let allMoves = this.game.moves({ square: this.transformIndexInSquare(this.selectedPiece) })
        allMoves = allMoves.filter(move => move.includes("=" + choice))
        const oldLetter = this.transformIndexInSquare([this.selectedPiece])[0].charAt(0), 
        newLetter = this.transformIndexInSquare([this.waitingPromotion])[0].charAt(0)
        allMoves = allMoves.filter(move => move.startsWith(oldLetter))
        if(oldLetter != newLetter) allMoves = allMoves.filter(move => move.includes('x' + newLetter + '8')) 
        else allMoves = allMoves.filter(move => !(move.includes('x' + newLetter + '8')))
        return allMoves[0]
    }

    getMap(chessboard) {
        let tempArr = new Array(0)

        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                if(chessboard[i][j]) tempArr.push(chessboard[i][j].color + chessboard[i][j].type.toUpperCase())
                else tempArr.push(null)
            }   
        }

        return tempArr
    }

    getGoodPiece(indexClick) {
        return this.getPiece(indexClick)?.color === this.game.turn()
    }
}