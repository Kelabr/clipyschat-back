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
        const {email, password} = req.body

        try{
            const user = await prisma.user.findUnique({
            where:{email}
            })

            if(!user){
                return res.status(404).json({message: "Usuário não encontrado"})
            }

            const passwordMatch = await bcrypt.compare(password, user.password)

            if(!passwordMatch){
                return res.status(401).json({message:"Usuário não encontrado" })
            }

            const {id} = user
            const {name} = user

             const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "7d"})

            res.cookie("userToken", token, {
                httpOnly:true, 
                secure: false,
                sameSite:"lax",
                maxAge: 1000 * 60 * 60 * 24 * 7
            })

            return res.status(200).json({data:{name:name}})
        }catch (err){
            console.log("Erro ao fazer login...")
        }

    

        

    }

    async del(req, res){

    }


    async me(req, res){
        const token = req.cookies.userToken

        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            const userId = payload.id
            const user = await prisma.user.findUnique({
                where:{id: userId}
            })

            return res.status(200).json({name:user.name})
        }catch(erro){
            console.log(`Error --- ${erro}`)
        }
    }
}


export default new UserController()


