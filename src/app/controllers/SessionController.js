import jwt from "jsonwebtoken"
import "dotenv/config"

class SessionController {
    async check(req, res){
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({message:"Token de acesso não enviado "})
        }

        const accessToke = authHeader.split(" ")[1]
        let isAccessValid = true

        try{
            jwt.verify(accessToke, process.env.JWT_SECRET);
        }catch (err){
            isAccessValid = false
        }

        const refreshToken = req.cookies.userToken;

        if(!refreshToken){
            return res.status(401).json({message: "Refresh Token não enviado"})
        }

        if(isAccessValid){
            return res.status(200).json({message: "Autenticado"});
        }

        try{
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

            const newAcessToken = jwt.sign(
                {id: decoded.id},
                process.env.JWT_SECRET,
                {expiresIn: "5m"}
            );

            console.log("Novo access token gerado")

            return res.status(200).json({
                message: "Token renovado",
                accessToken: newAcessToken
            });
        }catch (err){
            console.log("Refresh expirado", err);

            return res.status(401).json({message: "Sessão expirada, faça um novo login" })
        }
       
    }
}

export default new SessionController()