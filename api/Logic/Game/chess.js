import { Chess } from 'chess.js'
import Games from '../../Models/Games.js'
import Player from '../../Models/Players.js'

export default class Game {
    constructor(firstPlayer, gameMode, idGame) {
        this.firstPlayer = firstPlayer
        this.eloFirstPlayer = null
        this.secondPlayer = null
        this.eloSecondPlayer = null
        this.modifyEloSecond = null
        this.modifyEloFirst = null

        this.game = new Chess()
        this.gameMode = gameMode
        this.idGame = idGame
        this.watchers = new Array(0)
        this.selectedPiece = null
        this.waitingPromotion = null
        this.pgn = ''
        this.resultFirst = null
        this.resultSecond = null
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
            if(square[i].endsWith("+") || square[i].endsWith("#")) square[i] = square[i].substring(0, square[i].length - 1)
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

    async getEloOfPlayers() {
        const eloFirst = await Player.findOne({
            attributes: ['Elo'], 
            where: { Pseudo: this.firstPlayer }
        })
        if(eloFirst === null || eloFirst === undefined) return
        this.eloFirstPlayer = eloFirst.dataValues.Elo

        const eloSecond = await Player.findOne({
            attributes: ['Elo'], 
            where: { Pseudo: this.secondPlayer }
        })
        if(eloSecond === null || eloSecond === undefined) return
        this.eloSecondPlayer = eloSecond.dataValues.Elo
    }

    probabilityFirstPlayer() {
        let difference = Math.min(this.eloFirstPlayer - this.eloSecondPlayer, 400)
        return (1 / (1 + Math.pow(10, difference / -400)))
    }

    async modifyElo() {
        const probaFirst = this.probabilityFirstPlayer()
        const resultFirst = this.resultFirst == 0 ? 0.5 : this.resultFirst == 1 ? 1 : 0
        const resultSecond = this.resultSecond == 0 ? 0.5 : this.resultSecond == 1 ? 1 : 0
        this.modifyEloFirst = Math.ceil(20 * (resultFirst - probaFirst))
        this.modifyEloSecond = Math.ceil(20 * (resultSecond - 1 + probaFirst))
        const newEloFirst = this.eloFirstPlayer + this.modifyEloFirst
        const newEloSecond = this.eloSecondPlayer + this.modifyEloSecond

        //Update first player :
        await Player.update({ Elo: newEloFirst }, { 
            where: { Pseudo: this.firstPlayer } 
        })

        //Update second player 
        await Player.update({ Elo: newEloSecond }, { 
            where: { Pseudo: this.secondPlayer } 
        })

        await this.computeMaxElo(newEloFirst, newEloSecond)
    }
 
    async computeMaxElo(newEloFirst, newEloSecond) {
        let firstPlayerMax = await Player.findOne({ attributes: ['MaxElo'], where: { Pseudo: this.firstPlayer } })
        let secondPlayerMax = await Player.findOne({ attributes: ['MaxElo'], where: { Pseudo: this.secondPlayer } })

        firstPlayerMax = firstPlayerMax.dataValues.MaxElo
        secondPlayerMax = secondPlayerMax.dataValues.MaxElo

        console.log(firstPlayerMax, secondPlayerMax)

        if(firstPlayerMax < newEloFirst) await Player.update({ maxElo: newEloFirst }, {
            where: { Pseudo: this.firstPlayer }
        })
        if(secondPlayerMax < newEloSecond) await Player.update({ maxElo: newEloSecond }, {
            where: { Pseudo: this.secondPlayer }
        }) 
    }

    async putIdForPseudo(pseudo) {
        let idPseudo = await Player.findOne({ 
            attributes: ['id'], 
            where: { Pseudo: pseudo }
        })
        console.log(idPseudo)
        idPseudo = idPseudo.dataValues.id
        console.log(idPseudo)
        return idPseudo
    }

    gameDate() {
        const dateGame = new Date()
        const month = dateGame.getMonth() < 10 ? "0" + dateGame.getMonth() : dateGame.getMonth()
        const year = dateGame.getFullYear() < 10 ? "0" + dateGame.getFullYear() : dateGame.getFullYear()
        const date = dateGame.getDate() < 10 ? "0" + dateGame.getDate() : dateGame.getDate()
        return date + "-" + month + "-" + year
    }

    async addGameInDb() {
        await Games.create({ 
            result: this.resultFirst,  
            eloPlayer1: this.eloFirstPlayer, 
            eloPlayer2: this.eloSecondPlayer, 
            player1: await this.putIdForPseudo(this.firstPlayer),
            player2: await this.putIdForPseudo(this.secondPlayer), 
            pgn: this.game.pgn(), 
            dateGame: this.gameDate()
        })
    }

    // 1 for the win
    // 0 for the draw
    //2 for the lose
    computeResult() {
        if(this.game.in_draw()) return 0;
        return this.game.turn() === 'b' ? 1 : 2
    }

    //Will be called at each ends of game and add the game in the DB and the elo / max elo 
    async endingGame(result) {
        if(result) this.result = result
        else this.resultFirst = this.computeResult()
        this.resultSecond = this.resultFirst == 0 ? 0 : this.resultFirst == 1 ? 2 : 1

        await this.addGameInDb()
        await this.modifyElo()

        return {
            eloFirst: this.eloFirstPlayer, 
            eloSecond: this.eloSecondPlayer, 
            differenceEloFirst: this.modifyEloFirst, 
            differenceEloSecond: this.modifyEloSecond
        }
    }
}