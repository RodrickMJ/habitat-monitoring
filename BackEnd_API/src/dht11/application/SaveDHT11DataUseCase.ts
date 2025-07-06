import { Dht11Repository } from '../domain/dht11Repository';
import { DHT11 } from '../domain/dht11';

export class SaveDHT11DataUseCase {
  constructor(private dht11Repository: Dht11Repository) {}

  async execute(data: DHT11): Promise<void> {
    await this.dht11Repository.save(data);
  }
}