export class DHT11 {
    public temperature: number; 
    public humidity: number; 



    constructor(temperature: number, humidity: number){
        this.temperature = temperature;
        this.humidity = humidity;
    }
}