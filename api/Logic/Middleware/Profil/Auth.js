import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
dotenv.config()

const auth = (req, res, next) => {
    // let user = req.params.user
    // console.log(jwt)
    // console.log(process.env.SALT_JWT)
    // try {
    //     const token = req.headers.authorization.split(" ")[1]
    //     console.log(token);
    //     const decodedToken = jwt.verify(token, process.env.SALT_JWT)
    //     console.log(decodedToken);
    //     const userId = decodedToken.userId
    //     let logged = !!(user && user == userId)
    //     if(logged) next()
    //     else return res.status(401).json({ information: 'Unsuccessfully logged in !' })
    // } catch {
    //     return res.status(400).json({ error: 'Invalid request !' })
    // }
    return true
}

export default auth