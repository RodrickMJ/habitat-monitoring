import { Request, Response } from "express";
import { CameraOnUseCase } from "../../application/CameraOnUseCase";


export class OnController {
    constructor(private cameraOnUseCase: CameraOnUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            await this.cameraOnUseCase.execute();
            res.json({ status: 'Camera is on' });
        } catch (error) {
            console.error('Error turning camera on:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}