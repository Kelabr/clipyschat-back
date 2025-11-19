import app from "./app.js"
import { WebSocketServer } from "ws"

const wss = new WebSocketServer({port:8000})

wss.on("connection", (ws)=>{

    ws.on("error", () => console.log("Erro ao conectar"))

    ws.on("message", (data)=>{
        wss.clients.forEach((client) => client.send(data.toString()))
    })

    console.log("Client Connected")

})

app.listen(3001, () => {
    console.log("Server Start...")
})