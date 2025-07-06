import { Dht11Repository } from '../domain/dht11Repository';

export class GetDataDHT11UseCase {
  constructor(private dht11Repository: Dht11Repository) {}

  async execute(): Promise<any[]> {
    return this.dht11Repository.getAll();
  }
}