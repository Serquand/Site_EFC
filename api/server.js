import * as dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 6251

import express from 'express'
import * as http from "http"
import { Server } from "socket.io"
import Game from './Logic/Game/chess.js'
import cors from 'cors'
import { v4 } from 'uuid'

import setup from './Models/Setup.js'
import Profil from './router/Profil.js'
import { createParticularGame, handleChat, isTheGoodClient, isAuthentificated as auth } from './Logic/Game/WsFunctions.js'

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origins: [process.env.URL_WEBSITE] } })

app.use(cors(process.env.URL_WEBSITE))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use("/profil", Profil)

let sessions = {}, tempIdGame = null;
let availableId = new Array(0)

io.on("connection", socket => {
    console.log("A new user is connected !")
    socket.on("responseUser", async userInformation => {
        //We need to check if it's not a watcher and we will check if userInformation.game if ok and belongs a game which has already 2 players  
        if(!auth(userInformation) && (!userInformation.game && !sessions[userInformation.game] && !sessions[userInformation.game]?.game.secondPlayer)) 
            return;
        let msg;
        if(userInformation.game) msg = userInformation.game
        else if(tempIdGame) {
            msg = tempIdGame
            tempIdGame = null     
        } else {
           tempIdGame = v4()
           msg = tempIdGame
        }
        socket.session = msg
        const user = userInformation.user;

        if(!sessions[msg]) {
            sessions[msg] = [socket]
            sessions[msg].game = new Game(user, 'Simple', msg)
            socket.join("firstPlayer - " + msg)
            socket.join("players - " + msg)
            socket.emit("init")
        } else {
            if(sessions[msg].length == 1) {
                socket.join("players - " + msg)
                socket.join("secondPlayer - " + msg)
                sessions[msg].game.secondPlayer = user
                await sessions[msg].game.getEloOfPlayers()
                io
                    .to(["firstPlayer - " + msg])
                    .emit("beginningGameInfo", sessions[msg].game.eloFirstPlayer, sessions[msg].game.eloSecondPlayer, sessions[msg].game.secondPlayer, "w")
                
                io
                    .to(["secondPlayer - " + msg])
                    .emit("beginningGameInfo", sessions[msg].game.eloSecondPlayer, sessions[msg].game.eloFirstPlayer, sessions[msg].game.firstPlayer, "b")
                
                io.to(["players - " + msg]).emit("play")
            } else {
                sessions[msg].game.watchers.push(user)
                socket.join("Watchers " + msg)
            }
            sessions[msg].push(socket)
        }

        socket.on("newInfoClick", async indexClick => {
            if(isTheGoodClient(sessions, socket, msg)) {
                if(sessions[msg].game.selectedPiece) {
                    const infoMove = sessions[msg].game.movePiece(indexClick)
                    if(typeof(infoMove) === 'object') io.to(["players - " + msg, "Watchers " + msg]).emit("moveTo", infoMove.map, infoMove.pgn)
                    else if(sessions[msg].game.isPromoAllowed(indexClick)) socket.emit("promotion", sessions[msg].game.game.turn())
                    else socket.emit("cancel")
                    if(sessions[msg].game.game.in_checkmate() || sessions[msg].game.game.in_draw()) {
                        const information = await sessions[msg].game.endingGame()
                        delete sessions[msg]
                        io.to(["firstPlayer - " + msg]).emit("endOfGame", information.eloFirst, information.differenceEloFirst)
                        io.to(["secondPlayer - " + msg]).emit("endOfGame", information.eloSecond, information.differenceEloSecond)
                    } 
                } else if(sessions[msg].game.getGoodPiece(indexClick)) {
                    sessions[msg].game.selectedPiece = indexClick
                    const possibleMove = sessions[msg].game.getPossibleMove(indexClick)
                    if(possibleMove.length == 0) sessions[msg].game.selectedPiece = null 
                    else socket.emit("showMoveTab", possibleMove)
                } 
            }
        })

        socket.on("promotionChoice", choice => {
            if(!isTheGoodClient(sessions, socket, msg)) return
            const infoMove = sessions[msg].game.createPromotion(choice)
            io.to(["players - " + msg, "Watchers " + msg]).emit("moveTo", infoMove.map, infoMove.pgn)
            if(sessions[msg].game.game.in_checkmate()) console.log("Il y a échec et mat !")
            else if(sessions[msg].game.game.in_draw()) console.log("Il y a match nul !")
        })

        socket.on("message", message => handleChat(io, sessions, socket, msg, message))
        socket.on("askDraw", () => console.log("Draw !"))
        socket.on("giveUp", () => console.log("giveUp !"))
        socket.on("confirmDraw", () => console.log("confirmDraw"))

        socket.on("disconnect", () => {
            console.log("We will disconnect !")
            console.log(sessions, msg)
        })
    })

    socket.on("generateLink", () => {
        const gameId = v4()
        availableId.push({ id: gameId, count: 0 })
        socket.emit("linkGenerated", gameId)
        socket.join("Waiters - " + gameId)
    })

    socket.on("answerSearching", link => availableId = createParticularGame(availableId, socket, io, link))

    socket.on("watchAllGames", () => {
        socket.join("AllWatchers")
        const allFullGames = Object.keys(sessions)
        let gameParse = new Array(0)
        for(let i = 0; i < allFullGames.length; i++) {
            if(sessions[allFullGames[i]].game.secondPlayer == null) continue;
            gameParse.push({
                idGame: allFullGames[i],
                board: sessions[allFullGames[i]].game.game.board(), 
                firstPlayer: sessions[allFullGames[i]].game.firstPlayer, 
                eloFirstPlayer: sessions[allFullGames[i]].game.eloFirstPlayer, 
                secondPlayer: sessions[allFullGames[i]].game.secondPlayer,
                eloSecondPlayer: sessions[allFullGames[i]].game.eloSecondPlayer,
            })
        }
        socket.emit("answerAllGames", gameParse)
    })
})


httpServer.listen(PORT, async () => {
    await setup()
    console.clear()
    console.log("We are listening on PORT :", PORT)
})