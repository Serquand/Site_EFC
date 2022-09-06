import Players from '../../../Models/Players.js';

export default async function getProfil(req, res, next) {
    const profil = (await Players.findOne({ where: { Pseudo: req.params.user } }))[0].dataValues
    console.log(profil)
    delete profil.Password
    return res.status(200).json({ profil })
}