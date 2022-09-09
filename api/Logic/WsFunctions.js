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