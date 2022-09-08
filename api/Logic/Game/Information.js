/*const eloUser1 = 1800
const eloUser2 = 2005
const matchPlayed = 31
const wasUp = false

const probabilityFirstPlayer = (myPlayer, opponentElo) => {
    let difference = Math.min(myPlayer - opponentElo, 400)
    return (1 / (1 + Math.pow(10, difference / -400)))
}

const computeElo = (myPlayer, opponentElo, result1, result2) => {
    const k = matchPlayed < 30 ? 40 : (myPlayer >= 2400 || wasUp) ? 10 : 20 
    const probaFirst = probabilityFirstPlayer(myPlayer, opponentElo)
    console.log(probaFirst);
    console.log(k);
    const eloWin1 = Math.ceil(k * (result1 - probaFirst))
    const eloWin2 = Math.ceil(k * (result2 - 1 + probaFirst))
    console.log(eloWin1 + " ////// " + eloWin2);
}

computeElo(eloUser1, eloUser2, 0, 1)*/

const gameDate = () => {
    const dateGame = new Date()
    const month = dateGame.getMonth() < 10 ? "0" + dateGame.getMonth() : dateGame.getMonth()
    const year = dateGame.getFullYear() < 10 ? "0" + dateGame.getFullYear() : dateGame.getFullYear()
    const date = dateGame.getDate() < 10 ? "0" + dateGame.getDate() : dateGame.getDate()
    return date + "-" + month + "-" + year
}

console.log(gameDate())