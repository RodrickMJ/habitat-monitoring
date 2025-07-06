import { Request, Response } from "express";
import { GetByIdAnimalUseCase } from "../../application/GetByIdAnimalUseCase";
import { Animal } from "../../domain/Animal";


export class GetByIdAnimalController {
    constructor(private getByIdAnimalUseCase: GetByIdAnimalUseCase) { }

    async run(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;
            const animal = await this.getByIdAnimalUseCase.getById(id, userId);

            res.status(200).json({
                message: 'Animal retrieved successfully',
                success: true,
                data: animal,
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

