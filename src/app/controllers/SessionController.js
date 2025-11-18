import jwt from "jsonwebtoken"
import "dotenv/config"

class SessionController {
    async check(req, res){
        const token = req.cookies.userToken;

        if(!token){
            return res.status(401).json({messagem: "Falha na Autenticação"})
        }

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);


            return res.status(200).json({message:"Autenticado"})

        } catch(err){
            console.log(`Erro - ${err}`)
            return res.status(401).json({messagem: "Falha na Autenticação"})            
        }
    }
}

export default new SessionController()