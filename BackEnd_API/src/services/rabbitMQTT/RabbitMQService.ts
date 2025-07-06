import mqtt, { MqttClient } from 'mqtt';
import WebsocketService from '../Socekt.io/Socke.io';
import dotenv from 'dotenv';
import { SaveDHT11DataUseCase } from '../../dht11/application/SaveDHT11DataUseCase';
import { DHT11 } from '../../dht11/domain/dht11';

dotenv.config();

export class MqttService {
  private client: MqttClient | null = null;
  private topic = process.env.MQTT_TOPIC as string;
  private onMessageCallback: ((message: string) => void) | null = null;

  constructor(
    private mqttServer: string,
    private mqttPort: number,
    private mqttUser: string,
    private mqttPassword: string,
    private saveDHT11DataUseCase: SaveDHT11DataUseCase,
   
  ) 
  {}
  private externalWebsocket = new WebsocketService()
  public connect(): void {
    const options = {
      port: this.mqttPort,
      username: this.mqttUser,
      password: this.mqttPassword,
    };

    this.client = mqtt.connect(this.mqttServer, options);

    this.client.on('connect', () => {
      console.log('Conectado al broker MQTT');
      this.client?.subscribe(this.topic, (err) => {
        if (err) {
          console.error('Error al suscribirse al tema', err);
        } else {
          console.log('Suscrito al tema:', this.topic);
        }
      });
    });

    this.client.on('message', async (topic: string, message: Buffer) => {
      const messageString = message.toString();
      // console.log('Mensaje recibido:', messageString);
     await this.externalWebsocket.sendMessage("dataDHT11", messageString);
      if (this.onMessageCallback) {
        this.onMessageCallback(messageString);
      }

      try {
        const data = JSON.parse(messageString);

        if (
          data.humidity !== undefined &&
          data.temperature !== undefined
        ) {
          const dht11Data = new DHT11(data.temperature, data.humidity);
          await this.saveDHT11DataUseCase.execute(dht11Data);
          // console.log('Datos guardados correctamente en la base de datos');
        } else {
          console.warn('Datos incompletos recibidos:', data);
        }
      } catch (error) {
        console.error('Error al procesar el mensaje MQTT:', error);
      }
    });
  }

  public onMessage(callback: (message: string) => void): void {
    this.onMessageCallback = callback;
  }
}
