import express from 'express'
const router = express.Router()

import auth from '../Logic/Middleware/Profil/Auth.js'
import login from '../Logic/Middleware/Profil/Login.js'
import getProfil from '../Logic/Middleware/Profil/GetProfil.js'

router.post("/login", login)
router.get("/profil/:userSearched", getProfil)
router.get("/auth/:user", auth, (req, res) => res.status(200).json({ information: 'User connected !' }))

export default router