import { Dht11Repository } from '../domain/dht11Repository';

export class GetDHT11ByIdUseCase {
  constructor(private dht11Repository: Dht11Repository) {}

  async execute(id: number): Promise<any> {
    return this.dht11Repository.getDataById(id);
  }
}