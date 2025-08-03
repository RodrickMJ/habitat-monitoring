import { Request, Response } from 'express';
import { GetDataDHT11UseCase } from '../../application/GetDHT11DataUseCase';

export class GetAllDataDHT11Controller {
  constructor(private getDataDHT11UseCase: GetDataDHT11UseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.getDataDHT11UseCase.execute();
      res.status(200).json({
        message: 'Data retrieved successfully',
        success: true,
        data: data,
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
