import { Request, Response } from 'express';
import { GetDHT11ByIdUseCase } from '../../application/GetDHT11DataByIdUseCase';

export class GetDHT11ByIdController {
  constructor(private getDHT11ByIdUseCase: GetDHT11ByIdUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({
          message: 'Invalid ID format',
          success: false,
        });
        return;
      }

      const data = await this.getDHT11ByIdUseCase.execute(id);

      if (data === null) {
        res.status(404).json({
          message: 'DHT11 data not found',
          success: false,
        });
        return;
      }

      res.status(200).json({
        message: 'DHT11 data retrieved successfully',
        success: true,
        data: {
          temperature: data.temperature,
          humidity: data.humidity
        },
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
