import { Request, Response } from "express";
import { GetAllAnimalUseCase } from "../../application/GetAllAnimalUseCase";

export class GetAllAnimalController {
    constructor(private getAllAnimalUseCase: GetAllAnimalUseCase) { }

    async run(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id; 
            const animals = await this.getAllAnimalUseCase.getAll();

            res.status(200).json({
                animals,
                success: true,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }
    }
}
