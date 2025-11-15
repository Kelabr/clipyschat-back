import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import "dotenv/config"

const prisma = new PrismaClient()

class UserController {
    async create(req, res){
        const {name, email, date, password} = req.body

         const passwordHash = await bcrypt.hash(password, 10)

        try{
            const user = await prisma.user.findUnique({where:{email}})
            if(user){
                return res.status(409).json({message: "This email already exists."})
            }

            const newUser = await prisma.user.create({
                data:{name, email, date, password:passwordHash}
            })

            const {id} = newUser

            const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "7d"})

            res.cookie("userToken", token, {
                httpOnly:true, 
                secure: false,
                sameSite:"lax",
                maxAge: 1000 * 60 * 60 * 24 * 7
            })

            return res.status(201).json({message: `The user ${name} `})
        }catch (error){
            console.log(`Error: ${error}`)
        }

    }

    async login(req, res){

    }

    async del(req, res){

    }
}


export default new UserController()


