import Players from '../../../Models/Players.js';
import Games from '../../../Models/Games.js';
import Sequelize from 'sequelize';
const Op = Sequelize.Op

const pseudoWhoIdBelongs = async id  => {
    const userPseudo = await Players.findOne({
        where: { id }, 
        attributes: ['Pseudo']
    })
    return userPseudo.dataValues.Pseudo
}

const resultToLetter = (game, user) => {
    if(game.result == 0) return "D"
    if(user === game.player1) {
        return game.result == 1 ? 'W' : 'L'
    }
    return game.result == 1 ? 'L' : 'W'
}

export default async function getProfil(req, res) {
    const profil = (await Players.findOne({ 
        where: { Pseudo: req.params.userSearched }, 
        attributes: ["Pseudo", "Elo", "maxElo", "pointsPrediction", "id"] 
    })).dataValues, idPlayer = profil.id 
    delete profil.id
    let allGames = new Array(0)

    const allGamesTemp = await Games.findAll({ 
        where: {
            [Op.or]: [
                { player1: idPlayer }, 
                { player2: idPlayer }
            ]
        }
    })

    for(let i = 0; i < allGamesTemp.length; i++) {
        const game = allGamesTemp[i].dataValues
        delete game.updatedAt
        delete game.pgn
        game.player1 = await pseudoWhoIdBelongs(game.player1)
        game.player2 = await pseudoWhoIdBelongs(game.player2)
        game.result = resultToLetter(game, req.params.userSearched)
        game.color = game.player1 == req.params.userSearched ? 'w' : 'b'
        allGames.push(game)
    }
    
    return res.status(200).json({ profil, allGames })
}