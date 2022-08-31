import * as dotenv from 'dotenv'
dotenv.config()

import * as http from "http"
const server = http.createServer()
import { Server } from "socket.io"
import Game from './Logic/chess.js'

const io = new Server(server, { cors: { origins: [process.env.URL_WEBSITE] } })
const PORT = process.env.PORT || 6251

const sessions = {}

io.on("connection", socket => {
    console.log("A new user is connected !")

    socket.on("responseUser", msg => {
        const user = msg.split("-")[1].trim()
        msg = msg.split("-")[0].trim()
        socket.session = msg

        if(!sessions[msg]) {
            sessions[msg] = [socket]
            sessions[msg].game = new Game(user, 'Simple', msg)
            socket.join("firstPlayer - " + msg)
        } else {
            if(sessions[msg].length == 1) {
                socket.join("secondPlayer - " + msg)
                sessions[msg].game.secondPlayer = user
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
    })
})


server.listen(PORT, () => {
    console.clear()
    console.log("We are listening on PORT :", PORT)
})