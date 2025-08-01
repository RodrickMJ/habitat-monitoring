import { Dht11Repository } from '../../../domain/dht11Repository';
import { DHT11 } from '../../../domain/dht11';
import { dbMongo } from "../../../../database/mongo/mongodb";
import { Collection } from 'mongodb';

export class DHT11RepositoryMongo implements Dht11Repository {
  private readonly collection: Collection<DHT11>;

  constructor() {
    this.collection = dbMongo.collection('dht11');
  }

  public async save(data: DHT11): Promise<void> {
    await this.collection.insertOne(data);
  }

  public async getAll(): Promise<DHT11[]> {
    return this.collection.find().toArray();
  }

  public async getDataById(id: number): Promise<DHT11 | null> {
    const result = await this.collection.findOne({ id });
    return result || null;
  }
}
