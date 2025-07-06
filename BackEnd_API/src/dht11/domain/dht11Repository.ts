import { DHT11 } from './dht11';

export interface Dht11Repository {
  save(data: DHT11): Promise<void>;
  getAll(): Promise<DHT11[]>;
  getDataById(id: number): Promise<DHT11 | null>; 
}
