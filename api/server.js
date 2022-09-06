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
import auth from './Logic/Game/Auth'

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origins: [process.env.URL_WEBSITE] } })

app.use(cors(process.env.URL_WEBSITE))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use("/profil", Profil)

let sessions = {}, tempIdGame = null;

const isTheGoodClient = (socket, idSession) => socket.rooms.has((sessions[idSession].game.game.turn() === 'w' ? 'firstPlayer - ' : 'secondPlayer - ') + idSession)

io.on("connection", socket => {
    console.log("A new user is connected !")
    socket.on("responseUser", userInformation => {
        if(!auth(userInformation)) return;
        if(tempIdGame) {
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
                io.to(["players - " + msg]).emit("play")
                
                console.log("Nous allons lancer un match opposant " + 
                    sessions[msg].game.firstPlayer + " à " + sessions[msg].game.secondPlayer
                );
            } else {
                sessions[msg].game.watchers.push(user)
                socket.join("Watchers " + msg)
                console.log("La partie " + sessions[msg].game.idGame + " a les viewers : " + sessions[msg].game.watchers);
            }
            sessions[msg].push(socket)
        }

        socket.on("newInfoClick", indexClick => {
            if(isTheGoodClient(socket, msg)) {
                if(sessions[msg].game.selectedPiece) {
                    const infoMove = sessions[msg].game.movePiece(indexClick)
                    if(typeof(infoMove) === 'object') io.to(["players - " + msg, "Watchers " + msg]).emit("moveTo", infoMove.map, infoMove.pgn)
                    else if(sessions[msg].game.isPromoAllowed(indexClick)) socket.emit("promotion", sessions[msg].game.game.turn())
                    else socket.emit("cancel")
                } else if(sessions[msg].game.getGoodPiece(indexClick)) {
                    sessions[msg].game.selectedPiece = indexClick
                    const possibleMove = sessions[msg].game.getPossibleMove(indexClick)
                    if(possibleMove.length == 0) sessions[msg].game.selectedPiece = null 
                    else socket.emit("showMoveTab", possibleMove)
                } 
            }
        })

        socket.on("promotionChoice", choice => {
            const infoMove = sessions[msg].game.createPromotion(choice)
            io.to(["players - " + msg, "Watchers " + msg]).emit("moveTo", infoMove.map, infoMove.pgn)
        })
    })
})


httpServer.listen(PORT, async () => {
    await setup()
    console.clear()
    console.log("We are listening on PORT :", PORT)
})