import Games from "../../../Models/Games.js";
import { pseudoWhoIdBelongs, resultToLetter } from "./GetProfil.js";

export default async function review(req, res) {
    let reviewGame = await Games.findOne({
        where: { id: req.params.idGame }, 
        attributes: ['eloPlayer1','eloPlayer2', 'player1', 'player2', 'pgn']
    })

    reviewGame.player1 = await pseudoWhoIdBelongs(reviewGame.player1)
    reviewGame.player2 = await pseudoWhoIdBelongs(reviewGame.player2)
    reviewGame = reviewGame.dataValues

    res.status(200).json({ reviewGame })
}