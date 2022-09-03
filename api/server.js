import * as dotenv from 'dotenv'
dotenv.config()

import * as http from "http"
const server = http.createServer()
import { Server } from "socket.io"
import Game from './Logic/chess.js'

const io = new Server(server, { cors: { origins: [process.env.URL_WEBSITE] } })
const PORT = process.env.PORT || 6251

const sessions = {}

const isTheGoodClient = (socket, idSession) => socket.rooms.has((sessions[idSession].game.game.turn() === 'w' ? 'firstPlayer - ' : 'secondPlayer - ') + idSession)

io.on("connection", socket => {
    console.log("A new user is connected !")

    socket.on("responseUser", msg => {
        if(!msg?.includes("-")) return
        const user = msg.split("-")[1].trim()
        msg = msg.split("-")[0].trim()
        socket.session = msg

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
                    else socket.emit("promotion", sessions[msg].game.game.turn())
                } else if(sessions[msg].game.getGoodPiece(indexClick)) {
                    sessions[msg].game.selectedPiece = indexClick
                    const possibleMove = sessions[msg].game.getPossibleMove(indexClick)
                    if(possibleMove.length == 0) sessions[msg].game.selectedPiece = null 
                    else socket.emit("showMoveTab", possibleMove)
                } 
            }
        })

        socket.on("promotionChoice", choice => {
            console.log(choice)
            const infoMove = sessions[msg].game.createPromotion(choice)
            io.to(["players - " + msg, "Watchers " + msg]).emit("moveTo", infoMove.map, infoMove.pgn)
        })
    })
})


server.listen(PORT, () => {
    console.clear()
    console.log("We are listening on PORT :", PORT)
})