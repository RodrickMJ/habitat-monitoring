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
exports.MqttService = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const dotenv_1 = __importDefault(require("dotenv"));
const dht11_1 = require("../../dht11/domain/dht11");
dotenv_1.default.config();
class MqttService {
    constructor(mqttServer, mqttPort, mqttUser, mqttPassword, saveDHT11DataUseCase) {
        this.mqttServer = mqttServer;
        this.mqttPort = mqttPort;
        this.mqttUser = mqttUser;
        this.mqttPassword = mqttPassword;
        this.saveDHT11DataUseCase = saveDHT11DataUseCase;
        this.client = null;
        this.topic = process.env.MQTT_TOPIC;
        this.onMessageCallback = null;
    }
    connect() {
        const options = {
            port: this.mqttPort,
            username: this.mqttUser,
            password: this.mqttPassword,
        };
        this.client = mqtt_1.default.connect(this.mqttServer, options);
        this.client.on('connect', () => {
            var _a;
            console.log('Conectado al broker MQTT');
            (_a = this.client) === null || _a === void 0 ? void 0 : _a.subscribe(this.topic, (err) => {
                if (err) {
                    console.error('Error al suscribirse al tema', err);
                }
                else {
                    console.log('Suscrito al tema:', this.topic);
                }
            });
        });
        this.client.on('message', (topic, message) => __awaiter(this, void 0, void 0, function* () {
            const messageString = message.toString();
            // console.log('Mensaje recibido:', messageString);
            if (this.onMessageCallback) {
                this.onMessageCallback(messageString);
            }
            try {
                const data = JSON.parse(messageString);
                if (data.humidity !== undefined &&
                    data.temperature !== undefined) {
                    const dht11Data = new dht11_1.DHT11(data.temperature, data.humidity);
                    yield this.saveDHT11DataUseCase.execute(dht11Data);
                    console.log('Datos guardados correctamente en la base de datos');
                }
                else {
                    console.warn('Datos incompletos recibidos:', data);
                }
            }
            catch (error) {
                console.error('Error al procesar el mensaje MQTT:', error);
            }
        }));
    }
    onMessage(callback) {
        this.onMessageCallback = callback;
    }
}
exports.MqttService = MqttService;
