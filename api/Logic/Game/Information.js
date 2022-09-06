const eloUser1 = 1800
const eloUser2 = 1800
const matchPlayed = 31
const wasUp = false

const probability = (myPlayer, opponentElo) => {
    let difference = Math.min(myPlayer - opponentElo, 400)
    return (1 / (1 + Math.pow(10, difference / -400)))
}

const computeElo = (myPlayer, opponentElo, result1, result2) => {
    const k = matchPlayed < 30 ? 40 : (myPlayer >= 2400 || wasUp) ? 10 : 20 
    const proba = probability(myPlayer, opponentElo)
    console.log(proba);
    console.log(k);
    const eloWin1 = Math.ceil(k * (result1 - proba))
    const eloWin2 = Math.ceil(k * (result2 - proba))
    console.log(eloWin1 + " ////// " + eloWin2);
}

computeElo(eloUser1, eloUser2, 0.5, 0.5)