import { Router } from "express";
import user from "./app/controllers/UserController.js"
import session from "./app/controllers/SessionController.js"

const routes = Router();

routes.post("/register", user.create)
routes.post("/login", user.login)
routes.get("/me", user.me)

routes.get("/session", session.check)


export default routes