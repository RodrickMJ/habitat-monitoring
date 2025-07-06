import express from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { UserRouter } from './auth/infrasctucture/router/UserRoutes';
import { AnimalRouter } from './animal/infrasctucture/routes/AnimalRoutes';
import { CameraRouter } from './camera/infrasctructure/routes/CameraRoutes';
import { dhtRouter } from './dht11/infrasctructure/routes/dht11Routes';
import { SaveDHT11DataUseCase } from './dht11/application/SaveDHT11DataUseCase';
import { MySQLDHT11Repository } from './dht11/infrasctructure/adapters/mysql/MySQLDHT11Repository';

// Configurar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// ============= MIDDLEWARE =============
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ============= RUTAS =============
app.use('/api/v1/auth', UserRouter);
app.use('/api/v1/animal', AnimalRouter);
app.use('/api/v1/camera', CameraRouter);
app.use('/api/v1/dht11', dhtRouter);

// ============= CONFIGURACIÓN DHT11 =============
const dht11Repository = new MySQLDHT11Repository();
const saveDHT11DataUseCase = new SaveDHT11DataUseCase(dht11Repository);

// ============= VARIABLES MQTT (sin inicializar el servicio) =============
const mqttServer = process.env.MQTT_SERVER as string;
const mqttPort = parseInt(process.env.MQTT_PORT as string);
const mqttUser = process.env.MQTT_USER as string;
const mqttPassword = process.env.MQTT_PASSWORD as string;

// ============= MIDDLEWARE DE ERROR HANDLING (para testing) =============
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error in app:', err);
  res.status(500).json({
    message: 'Internal server error',
    success: false,
    ...(process.env.NODE_ENV === 'test' && { error: err.message })
  });
});

// ============= RUTA DE HEALTH CHECK =============
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============= EXPORTAR APP (sin ejecutar listen) =============
export { app, saveDHT11DataUseCase, dht11Repository };