import { Router } from "express";
import user from "./app/controllers/UserController.js"

const routes = Router();

routes.post("/login", user.create)


export default routes