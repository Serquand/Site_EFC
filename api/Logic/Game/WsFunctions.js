import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;
import * as dotenv from 'dotenv'
dotenv.config()

export const isAuthentificated = information => {
    if(!information) return false
    try {
        const logged = !!(information?.user == verify(information.token, process.env.SALT_JWT).userId)
        return logged
    } catch { return false }
}

const inWaitingArray = (availableId, link) => {
    for(let i = 0; i < availableId.length; i++) {
        if(availableId[i].id == link) return i;
    }
    return -1;
}

export const createParticularGame = (availableId, socket, io, link) => {
    const index = inWaitingArray(availableId, link)
    if(index != -1) {
        io.to("Waiters - " + link).emit("userJoined", link)
        socket.emit("gameFound")
        if(availableId[index].count == 0) availableId[index].count = 1
        else availableId.splice(index, 1)
    } else socket.emit("gameNotFound")
    return availableId
}

export const handleChat = (io, sessions, socket, idSessions, message) => {
    if(!isAuthentificated(message.informationUser)) return
    const actualSession = sessions[idSessions]
    if(socket.rooms.has('players - ' + idSessions)) {
        console.log("Test");
        actualSession.game.playerChat.push({
            user: 'Serkan', 
            message: message.message
        })
        io.to('players - ' + idSessions).emit("NewChat", actualSession.game.playerChat)
    } else {
        actualSession.game.viewerChat.push({
            user: 'Serkan', 
            message: message.message
        })
        io.to('Watchers ' + idSessions).emit("NewChat", actualSession.game.viewerChat)
    }
} 

export const isTheGoodClient = (sessions, socket, idSession) => 
    socket.rooms.has((sessions[idSession].game.game.turn() === 'w' ? 'firstPlayer - ' : 'secondPlayer - ') + idSession)

