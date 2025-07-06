import { Request, Response } from "express";
import { RegisterAnimalUseCase } from "../../application/RegisterAnimalUseCase";
import { Animal } from "../../domain/Animal";

export class RegisterAnimalController {
    constructor(private registerAnimalUseCase: RegisterAnimalUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const { name, breed, species, age, gender, color, size, notes } = req.body;
            const userId = (req as any).user.id; // Obtener el ID del usuario desde la solicitud

            const animal = new Animal(
                '', 
                name,
                breed,
                species,
                age,
                gender,
                color,
                size,
                userId,
                notes
            );
            await this.registerAnimalUseCase.registerAnimal(animal, userId);

            res.status(201).json({
                message: 'Animal registered successfully',
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
