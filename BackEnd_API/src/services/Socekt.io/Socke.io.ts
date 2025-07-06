import { Socket, io } from "socket.io-client";
import dotenv from "dotenv"
dotenv.config();

export default interface WebsocketService {
    sendMessage(event: string, data: any): Promise<void>
}

export default class ExternalWebsocketIo implements WebsocketService {
    private socket: Socket;

    constructor(){
        this.socket = io('http://54.165.181.210', {
            extraHeaders: {
                'authorization': process.env['KEY_WEBSOCKET']?.toString() ?? "123ADWAWDAWDQWDAD33"
            }
        });

        this.socket.on('connect',() => {
            console.log('Conectado al servidor Socket.IO externo');
        });

        this.socket.on('disconnect', () => {
            console.log('Desconectado del servidor Socket.IO externo');
          });

    }

    async sendMessage(event: string, data: any): Promise<void> {
        return new Promise ((resolve, reject) => {
            this.socket.emit(event, data, (error: any) => {
                if(error) {
                    reject(error);
                } else{
                    resolve();
                }
            })
        })
    }


}