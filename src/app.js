import express from "express";
import cors from 'cors';
import routes from "./routes.js"
import cookieParse from "cookie-parser"

class App {
    constructor(){
        this.server = express();
        this.middlewares();
        this.router()
    }

    middlewares(){
        this.server.use(express.json());
        this.server.use(cors({ origin: "http://localhost:3000", credentials: true}));
        this.server.use(cookieParse())
    }

    router(){
        this.server.use(routes);
    }
}

export default new App().server
