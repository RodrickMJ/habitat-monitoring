import express from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { testConnection } from './database/mysql/mysqldb';
import { UserRouter } from './auth/infrasctucture/router/UserRoutes';
import { AnimalRouter } from './animal/infrasctucture/routes/AnimalRoutes';
import { CameraRouter } from './camera/infrasctructure/routes/CameraRoutes';
import { dhtRouter } from './dht11/infrasctructure/routes/dht11Routes';
// import { MqttService } from './services/rabbitMQTT/RabbitMQService';
import { SaveDHT11DataUseCase } from './dht11/application/SaveDHT11DataUseCase';
import { MySQLDHT11Repository } from './dht11/infrasctructure/adapters/mysql/MySQLDHT11Repository';
// import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas
app.use('/api/v1/auth', UserRouter);
app.use('/api/v1/animal', AnimalRouter);
app.use('/api/v1/camera', CameraRouter);
app.use('/api/v1/dht11', dhtRouter);

const dht11Repository = new MySQLDHT11Repository();
const saveDHT11DataUseCase = new SaveDHT11DataUseCase(dht11Repository);

const mqttServer = process.env.MQTT_SERVER as string;
const mqttPort = parseInt(process.env.MQTT_PORT as string);
const mqttUser = process.env.MQTT_USER as string;
const mqttPassword = process.env.MQTT_PASSWORD as string;

// const mqttService = new MqttService(mqttServer, mqttPort, mqttUser, mqttPassword, saveDHT11DataUseCase);

// mqttService.connect();

const server = app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log('MySQL connected');
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
});

// Configuración del servidor Socket.IO
// const io = new SocketIOServer(server, {
//   cors: {
//     origin: '*',
//   },
// });

// io.use((socket, next) => {
//   const token = socket.handshake.query.token;

//   if (token) {
//     jwt.verify(token as string, process.env.SECRET_KEY!, (err: any) => {
//       if (err) return next(new Error('Authentication error'));
//       next();
//     });
//   } else {
//     next(new Error('Authentication error'));
//   }
// });

// io.on('connection', (socket) => {
//   console.log('Client authenticated and connected');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//     console.log()
//   });
// });

async function sendDataToClients() {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/dht11/all');
    const { data } = response.data;

    const filteredData = data.map((item: any) => ({
      
      temperature: item.temperature,
      humidity: item.humidity
    }));


   

    // io.emit('dht11Data', filteredData);
  } catch (error) {
    console.error('Error fetching data or sending to WebSocket:', error);
  }
}

setInterval(sendDataToClients, 2000);

// console.log(`WebSocket server is running on http://localhost:${PORT}`);
