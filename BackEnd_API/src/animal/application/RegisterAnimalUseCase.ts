import { Animal } from "../domain/Animal";
import { AnimalRepository } from "../domain/AnimalRepository";

export class RegisterAnimalUseCase {
    constructor(private repository: AnimalRepository) { }

    async registerAnimal(animal: Animal, userId: string): Promise<void> {
        animal.ownerId = userId;
        await this.repository.registerAnimal(animal);
    }
}
