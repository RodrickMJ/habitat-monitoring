import { Dht11Repository } from '../../../domain/dht11Repository';
import { DHT11 } from '../../../domain/dht11';
import { testConnection } from '../../../../database/mysql/mysqldb'; 
import mysql from 'mysql2/promise';

export class MySQLDHT11Repository implements Dht11Repository {
  public async save(data: DHT11): Promise<void> {
    const connection = await testConnection(); 
    try {
      const query = 'INSERT INTO dht11 (id, humidity, temperature) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE humidity = VALUES(humidity), temperature = VALUES(temperature)';
      await connection.execute(query, [data.humidity, data.temperature]);
    } finally {
      connection.release(); 
    }
  }

  public async getAll(): Promise<DHT11[]> {
    const connection = await testConnection();
    try {
      const [rows] = await connection.execute('SELECT temperature, humidity FROM dht11');
      return (rows as mysql.RowDataPacket[]).map(row => new DHT11(
        row.temperature,
        row.humidity
      ));
    } finally {
      connection.release();
    }
  }

  public async getDataById(id: number): Promise<DHT11 | null> {
    const connection = await testConnection();
    try {
      const query = 'SELECT temperature, humidity FROM dht11 WHERE id = ?';
      const [rows] = await connection.execute(query, [id]);
      const row = (rows as mysql.RowDataPacket[])[0];

      if (!row) {
        return null;
      }

      return new DHT11(
        row.temperature,
        row.humidity
      );
    } finally {
      connection.release();
    }
  }
}
