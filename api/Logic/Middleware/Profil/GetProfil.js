import Players from '../../../Models/Players.js';
import Games from '../../../Models/Games.js';
import Sequelize from 'sequelize';
const Op = Sequelize.Op

export default async function getProfil(req, res, next) {
    const profil = (await Players.findOne({ where: { Pseudo: req.params.user } })).dataValues, idPlayer = profil.id 
    delete profil.id
    delete profil.Password
    let allGames = new Array(0)

    const allGamesTemp = await Games.findAll({ 
        where: {
            [Op.or]: [
                { player1: idPlayer }, 
                { player2: idPlayer }
            ]
        }
    })
    for(let i = 0; i < allGamesTemp.length; i++) allGames.push(allGamesTemp[i].dataValues)
    
    return res.status(200).json({ profil, allGames })
}