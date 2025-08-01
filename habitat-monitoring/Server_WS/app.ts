import express, { request } from "express"
import http from "node:http"
import dotenv from "dotenv"
import { Server } from 'socket.io'
import authMiddleware from "./src/authMiddleware"
import emitData from "./src/helpers/EmitData"

dotenv.config();
const Port = 8082;

const app = express();
const server = http.createServer(app);

//configuracion de socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
    } ,
    allowRequest: authMiddleware
});


io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('dataDHT11', (data) => {
        
        const dataSend = JSON.parse(data)
      const messageFront =  emitData(dataSend)
      console.log(messageFront); 
      
     io.emit('sensors',messageFront )

    });

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });

});


server.listen(Port, () => {
    console.clear();
    console.log(`Servidor ejecutándose en http://localhost:${Port}`);
})





