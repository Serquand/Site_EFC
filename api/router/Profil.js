import express from 'express'
const router = express.Router()

import auth from '../Logic/Middleware/Profil/Auth'

router.get("/test", () => console.log("Test"))

export default router