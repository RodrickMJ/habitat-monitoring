"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const mysqldb_1 = require("./database/mysql/mysqldb");
const UserRoutes_1 = require("./auth/infrasctucture/router/UserRoutes");
const AnimalRoutes_1 = require("./animal/infrasctucture/routes/AnimalRoutes");
const CameraRoutes_1 = require("./camera/infrasctructure/routes/CameraRoutes");
const dht11Routes_1 = require("./dht11/infrasctructure/routes/dht11Routes");
const RabbitMQService_1 = require("./services/rabbitMQTT/RabbitMQService");
const SaveDHT11DataUseCase_1 = require("./dht11/application/SaveDHT11DataUseCase");
const MySQLDHT11Repository_1 = require("./dht11/infrasctructure/adapters/mysql/MySQLDHT11Repository");
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 7070;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// Rutas
app.use('/api/v1/auth', UserRoutes_1.UserRouter);
app.use('/api/v1/animal', AnimalRoutes_1.AnimalRouter);
app.use('/api/v1/camera', CameraRoutes_1.CameraRouter);
app.use('/api/v1/dht11', dht11Routes_1.dhtRouter);
const dht11Repository = new MySQLDHT11Repository_1.MySQLDHT11Repository();
const saveDHT11DataUseCase = new SaveDHT11DataUseCase_1.SaveDHT11DataUseCase(dht11Repository);
const mqttServer = process.env.MQTT_SERVER;
const mqttPort = parseInt(process.env.MQTT_PORT);
const mqttUser = process.env.MQTT_USER;
const mqttPassword = process.env.MQTT_PASSWORD;
const mqttService = new RabbitMQService_1.MqttService(mqttServer, mqttPort, mqttUser, mqttPassword, saveDHT11DataUseCase);
mqttService.connect();
const server = app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mysqldb_1.testConnection)();
        console.log('MySQL connected');
        console.log(`Server is running on port ${PORT}`);
    }
    catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}));
// Configuración del servidor Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err) => {
            if (err)
                return next(new Error('Authentication error'));
            next();
        });
    }
    else {
        next(new Error('Authentication error'));
    }
});
io.on('connection', (socket) => {
    console.log('Client authenticated and connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        console.log();
    });
});
function sendDataToClients() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('http://localhost:8080/api/v1/dht11/all');
            const { data } = response.data;
            const filteredData = data.map((item) => ({
                temperature: item.temperature,
                humidity: item.humidity
            }));
            io.emit('dht11Data', filteredData);
        }
        catch (error) {
            console.error('Error fetching data or sending to WebSocket:', error);
        }
    });
}
setInterval(sendDataToClients, 2000);
console.log(`WebSocket server is running on http://localhost:${PORT}`);
