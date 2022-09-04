import { verify } from "jsonwebtoken";
import { tokenJwt } from "../../config.json";

const auth = (req, res, next) => {
    let user = req.params.user
    try {
        console.log(req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1]
        const decodedToken = verify(token, tokenJwt)
        const userId = decodedToken.userId
        let logged = !!(user && user == userId)
        if(logged) next()
        else return res.status(401).json({ information: 'Unsuccessfully logged in !' })
    } catch {
        return res.status(400).json({ error: 'Invalid request !' })
    }
}

export default auth