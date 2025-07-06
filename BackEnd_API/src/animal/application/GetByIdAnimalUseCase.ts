import { Animal } from "../domain/Animal";
import { AnimalRepository } from "../domain/AnimalRepository";

export class GetByIdAnimalUseCase {
    constructor(private repository: AnimalRepository) { }

    async getById(id: string, userId: string): Promise<Animal | null> {
        const animal = await this.repository.getById(id);

        if (!animal) {
            return null; 
        }

        if (animal.ownerId !== userId) {
            throw new Error("Animal not found or does not belong to the user.");
        }

        return animal;
    }
}
