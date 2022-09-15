import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;
import * as dotenv from 'dotenv'
dotenv.config()

const auth = (req, res, next) => {
    console.log(req.headers.authorization);
    let user = req.params.user
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decodedToken = verify(token, process.env.SALT_JWT)
        const userId = decodedToken.userId
        let logged = !!(user && user == userId)
        if(logged) next()
        else return res.status(401).json({ information: 'Unsuccessfully logged in !' })
    } catch {
        return res.status(400).json({ error: 'Invalid request !' })
    }
    return true
}

export default auth