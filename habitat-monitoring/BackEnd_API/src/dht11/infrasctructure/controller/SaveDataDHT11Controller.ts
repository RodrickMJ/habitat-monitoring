import { Request, Response } from 'express';
import { SaveDHT11DataUseCase } from '../../application/SaveDHT11DataUseCase';
import { DHT11 } from '../../domain/dht11';

export class SaveDataDHT11Controller {
  constructor(private saveDHT11DataUseCase: SaveDHT11DataUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { humidity, temperature, timestamp } = req.body;

      if (humidity === undefined || temperature === undefined) {
        res.status(400).json({
          message: 'Invalid data: humidity, temperature, and timestamp are required',
          success: false,
        });
        return;
      }

      const newDHT11 = new DHT11(humidity, temperature);
      await this.saveDHT11DataUseCase.execute(newDHT11);

      res.status(201).json({
        message: 'DHT11 data saved successfully',
        success: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        message: errorMessage,
        success: false,
      });
    }
  }
}