import { Request, Response } from "express";
import { CameraOffUseCase } from "../../application/CameraOffUseCase";


export class OffController {
    constructor(private cameraOffUseCase: CameraOffUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            await this.cameraOffUseCase.execute();
            res.json({ status: 'Camera is off' });
        } catch (error) {
            console.error('Error turning camera off:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}