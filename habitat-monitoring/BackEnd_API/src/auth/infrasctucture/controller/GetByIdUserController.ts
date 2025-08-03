import { Request, Response } from 'express';
import { GetUserByIdUseCase } from '../../application/GetByIdUserUseCase';
import { Animal } from '../../../animal/domain/Animal';

export class GetUserByIdController {
    private useCase: GetUserByIdUseCase;

    constructor(useCase: GetUserByIdUseCase) {
        this.useCase = useCase;
    }

    public async run(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            
            const user = await this.useCase.execute(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const response = {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                animals: user.animals.map((animal: Animal) => ({
                    id: animal.id,
                    name: animal.name,
                    breed: animal.breed,
                    species: animal.species,
                    age: animal.age,
                    gender: animal.gender,
                    color: animal.color,
                    size: animal.size,
                    notes: animal.notes // Asegúrate de que este campo sea una cadena
                }))
            };

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
