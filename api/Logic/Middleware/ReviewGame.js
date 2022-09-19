import Games from "../../Models/Games.js";
import { pseudoWhoIdBelongs } from './Profil/GetProfil.js';

const convertPgnToArray = pgn => {
    let movesTab = new Array(0)
    const temp = pgn.split(".")
    temp.shift()
    for(let i = 0; i < temp.length; i++) {
        temp[i] = temp[i].trim()
        const moveExchange = temp[i].split(" ")
        movesTab.push(moveExchange[0])
        if(moveExchange[1]) movesTab.push(moveExchange[1])
    }
    return movesTab
}

export default async function review(req, res) {
    let reviewGame = await Games.findOne({
        where: { id: req.params.idGame }, 
        attributes: ['eloPlayer1','eloPlayer2', 'player1', 'player2', 'pgn']
    })

    reviewGame.player1 = await pseudoWhoIdBelongs(reviewGame.player1)
    reviewGame.player2 = await pseudoWhoIdBelongs(reviewGame.player2)
    reviewGame.pgn = convertPgnToArray(reviewGame.pgn)
    reviewGame = reviewGame.dataValues

    res.status(200).json({ reviewGame })
}