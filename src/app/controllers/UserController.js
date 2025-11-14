import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"

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

            await prisma.user.create({
                data:{name, email, date, password:passwordHash}
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


