import { Router } from "express";
import user from "./app/controllers/UserController.js"

const routes = Router();

routes.post("/register", user.create)
routes.post("/login", user.login)


export default routes